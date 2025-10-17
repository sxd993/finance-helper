SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================================================================
-- ОСНОВНЫЕ ТАБЛИЦЫ
-- ============================================================================

-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  distribution_mode ENUM('baseline', 'flex') NOT NULL DEFAULT 'baseline',
  monthly_income DECIMAL(12,2) DEFAULT NULL,
  cycle_type ENUM('weekly', 'monthly') NOT NULL DEFAULT 'weekly',
  percent_important DECIMAL(5,2) NOT NULL DEFAULT 50.0,
  percent_wishes DECIMAL(5,2) NOT NULL DEFAULT 30.0,
  percent_saving DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  percent_investment DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_login (login)
) ENGINE=InnoDB;

-- Типы конвертов (справочник)
CREATE TABLE IF NOT EXISTS convert_types (
  code VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Циклы
CREATE TABLE IF NOT EXISTS cycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  closed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_cycles_user_dates (user_id, start_date, end_date),
  INDEX idx_cycles_user_closed (user_id, is_closed)
) ENGINE=InnoDB;

-- Конверты (упрощенная единая таблица)
CREATE TABLE IF NOT EXISTS converts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT DEFAULT NULL COMMENT 'NULL = накопительный конверт',
  type_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  -- Универсальные поля
  target_amount DECIMAL(12,2) DEFAULT NULL COMMENT 'Цель для saving, лимит для important/wishes',
  initial_amount DECIMAL(12,2) DEFAULT NULL COMMENT 'Начальная сумма для investment',
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_converts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE SET NULL,
  CONSTRAINT fk_converts_types FOREIGN KEY (type_code) REFERENCES convert_types(code) ON DELETE RESTRICT,
  
  INDEX idx_converts_user_active (user_id, is_active),
  INDEX idx_converts_user_type (user_id, type_code),
  INDEX idx_converts_cycle (cycle_id),
  INDEX idx_converts_type (type_code)
) ENGINE=InnoDB;

-- Транзакции - единственный источник правды о деньгах
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  convert_id INT NOT NULL,
  type ENUM('deposit', 'spend', 'transfer_in', 'transfer_out') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_transactions_converts FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE,
  CONSTRAINT chk_amount_positive CHECK (amount > 0),
  
  INDEX idx_transactions_convert_date (convert_id, created_at DESC),
  INDEX idx_transactions_type (type),
  INDEX idx_transactions_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS convert_type_limits (
  user_id INT NOT NULL,
  type_code VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (user_id, type_code),
  CONSTRAINT fk_type_limits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_type_limits_type FOREIGN KEY (type_code) REFERENCES convert_types(code) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Остатки после закрытия цикла
CREATE TABLE IF NOT EXISTS remainders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  cycle_id INT NOT NULL,
  type_code VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_remainders_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_remainders_cycles FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE,
  CONSTRAINT fk_remainders_type FOREIGN KEY (type_code) REFERENCES convert_types(code) ON DELETE RESTRICT,
  
  UNIQUE KEY uk_remainder_cycle_type (cycle_id, type_code),
  INDEX idx_remainders_user (user_id)
) ENGINE=InnoDB;

-- ============================================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- ============================================================================

INSERT INTO convert_types (code, title, description, sort_order)
VALUES
  ('important',   'Необходимые расходы', 'Обязательные траты: аренда, продукты, коммуналка', 1),
  ('wishes',      'Желания', 'Необязательные покупки и развлечения', 2),
  ('saving',      'Накопления', 'Целевые накопления с заданной суммой', 3),
  ('investment',  'Инвестиции', 'Долгосрочные инвестиции', 4)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  sort_order = VALUES(sort_order);