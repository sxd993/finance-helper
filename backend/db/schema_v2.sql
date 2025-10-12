SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  distribution_mode ENUM('baseline', 'flex') NOT NULL DEFAULT 'baseline',
  monthly_income DECIMAL(12,2) DEFAULT NULL,
  cycle_type ENUM('weekly', 'monthly') NOT NULL DEFAULT 'weekly',
  percent_important DECIMAL(5,2) NOT NULL DEFAULT 50.0,
  percent_wishes DECIMAL(5,2) NOT NULL DEFAULT 30.0,
  percent_saving DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  percent_investment DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Типы конвертов
CREATE TABLE IF NOT EXISTS convert_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,  -- important, wishes, saving, investment
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Циклы
CREATE TABLE IF NOT EXISTS cycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  is_closed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Базовая таблица конвертов
CREATE TABLE IF NOT EXISTS converts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT DEFAULT NULL,          -- NULL = накопительный
  type_code VARCHAR(50) NOT NULL,     -- important, wishes, saving, investment
  name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_converts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_types_code FOREIGN KEY (type_code) REFERENCES convert_types(code) ON DELETE RESTRICT,
  INDEX idx_converts_user_active (user_id, is_active),
  INDEX idx_converts_type_code (type_code)
) ENGINE=InnoDB;

-- Детали для бюджетных конвертов (important/wishes)
CREATE TABLE IF NOT EXISTS convert_budget_details (
  convert_id INT PRIMARY KEY,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  overall_limit DECIMAL(12,2) DEFAULT 0,
  CONSTRAINT fk_budget_convert FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Детали для накоплений (saving)
CREATE TABLE IF NOT EXISTS convert_saving_details (
  convert_id INT PRIMARY KEY,
  target_amount DECIMAL(12,2) DEFAULT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_saving_convert FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Детали для инвестиций (investment)
CREATE TABLE IF NOT EXISTS convert_investment_details (
  convert_id INT PRIMARY KEY,
  initial_investment DECIMAL(12,2) DEFAULT NULL,
  current_value DECIMAL(12,2) DEFAULT NULL,
  last_updated DATETIME DEFAULT NULL,
  CONSTRAINT fk_investment_convert FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Остатки после закрытия цикла
CREATE TABLE IF NOT EXISTS remainders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_remainders_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_remainders_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Транзакции (пополнения/траты) — без отдельной таблицы deposits
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  convert_id INT NOT NULL,
  type ENUM('deposit', 'spend') NOT NULL, -- пополнение, трата
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_converts FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE,
  INDEX idx_transactions_convert (convert_id, created_at)
) ENGINE=InnoDB;

-- View для совместимости (плоский вид)
CREATE OR REPLACE VIEW v_converts_legacy AS
SELECT
  c.id,
  c.user_id,
  c.cycle_id,
  c.type_code,
  c.name,
  c.is_active,
  COALESCE(b.current_amount, s.current_amount, 0) AS current_amount,
  s.target_amount,
  b.overall_limit,
  i.initial_investment,
  i.current_value,
  i.last_updated,
  c.created_at,
  c.updated_at
FROM converts c
LEFT JOIN convert_budget_details b ON b.convert_id = c.id
LEFT JOIN convert_saving_details s ON s.convert_id = c.id
LEFT JOIN convert_investment_details i ON i.convert_id = c.id;

-- Сидинг типов конвертов
INSERT INTO convert_types (code, title)
VALUES
  ('important',   'Необходимые расходы'),
  ('wishes',      'Желания'),
  ('saving',      'Накопления'),
  ('investment',  'Инвестиции')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  updated_at = NOW();
