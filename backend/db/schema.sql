-- Пользователь
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  distribution_mode ENUM('baseline', 'flex') NOT NULL DEFAULT 'baseline',
  monthly_income DECIMAL(12,2) DEFAULT NULL, -- актуально только для baseline
  cycle_type ENUM('weekly', 'monthly') NOT NULL DEFAULT 'weekly', -- 🆕 тип циклов
  percent_important DECIMAL(5,2) NOT NULL DEFAULT 50.0,
  percent_wishes DECIMAL(5,2) NOT NULL DEFAULT 30.0,
  percent_saving DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  percent_investment DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Циклы (недели/месяцы)
CREATE TABLE IF NOT EXISTS cycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  is_closed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Типы конвертов
CREATE TABLE IF NOT EXISTS convert_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE, -- important, wishes, saving, investment
  title VARCHAR(255) NOT NULL,
  has_limit TINYINT(1) NOT NULL DEFAULT 1,
  accumulates TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Конверты (привязаны либо к cycle, либо вечные)
CREATE TABLE IF NOT EXISTS converts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT DEFAULT NULL, -- null = накопительный конверт
  type_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_amount DECIMAL(12,2) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_converts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_types FOREIGN KEY (type_id) REFERENCES convert_types(id) ON DELETE RESTRICT
);

-- Пополнения (депозиты)
CREATE TABLE IF NOT EXISTS deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_deposits_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Остатки (сюда уходят нераспределённые деньги после закрытия цикла)
CREATE TABLE IF NOT EXISTS remainders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_remainders_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_remainders_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
);

-- Транзакции (только пополнения и траты)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  convert_id INT NOT NULL,
  type ENUM('deposit', 'spend') NOT NULL, -- пополнение, трата
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_converts FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE
);

-- Индексы
CREATE INDEX idx_converts_user_active ON converts(user_id, is_active);
CREATE INDEX idx_converts_type ON converts(type_id);
CREATE INDEX idx_transactions_convert ON transactions(convert_id, created_at);

-- Сидинг типов конвертов
INSERT INTO convert_types (code, title, has_limit, accumulates)
VALUES
  ('important',   'Необходимые расходы', 1, 0),
  ('wishes',      'Желания',             1, 0),
  ('saving',      'Накопления',          0, 1),
  ('investment',  'Инвестиции',          0, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  has_limit = VALUES(has_limit),
  accumulates = VALUES(accumulates),
  updated_at = NOW();