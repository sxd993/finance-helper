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
  monthly_income DECIMAL(12,2) DEFAULT NULL,
  cycle_type ENUM('monthly') NOT NULL DEFAULT 'monthly',
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
  is_reset BOOLEAN NOT NULL DEFAULT FALSE,
  has_limit BOOLEAN NOT NULL DEFAULT FALSE,
  can_spend BOOLEAN NOT NULL DEFAULT FALSE,
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
  type_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  
  -- Универсальные поля
  target_amount DECIMAL(12,2) DEFAULT NULL COMMENT 'Цель для saving, лимит для important/wishes',
  initial_amount DECIMAL(12,2) DEFAULT NULL COMMENT 'Начальная сумма для investment',

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_converts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_types FOREIGN KEY (type_code) REFERENCES convert_types(code) ON DELETE RESTRICT,
  
  INDEX idx_converts_user_active (user_id, is_active),
  INDEX idx_converts_user_type (user_id, type_code),
  INDEX idx_converts_type (type_code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  convert_name VARCHAR(255) NOT NULL,
  convert_type VARCHAR(50) NOT NULL,
  sum DECIMAL(12,2) NOT NULL,
  date BIGINT UNSIGNED NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  icon_color VARCHAR(32) NOT NULL,
  
  CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_expenses_convert_type FOREIGN KEY (convert_type) REFERENCES convert_types(code) ON DELETE RESTRICT,
  CONSTRAINT chk_expenses_sum_positive CHECK (sum > 0),
  
  INDEX idx_expenses_user (user_id),
  INDEX idx_expenses_convert_type (convert_type),
  INDEX idx_expenses_date (date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS convert_type_limits (
  user_id INT NOT NULL,
  type_code VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL,
  distributed_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
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

INSERT INTO convert_types (code, title, description, is_reset, has_limit, can_spend, sort_order)
VALUES
  ('important',   'Необходимое', 'Обязательные траты: аренда, продукты, коммуналка', TRUE, TRUE, TRUE, 1),
  ('wishes',      'Желания', 'Необязательные покупки и развлечения', TRUE, TRUE, TRUE, 2),
  ('saving',      'Накопления', 'Целевые накопления с заданной суммой', FALSE, TRUE, FALSE, 3),
  ('investment',  'Инвестиции', 'Долгосрочные инвестиции', FALSE, FALSE, FALSE, 4)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  is_reset = VALUES(is_reset),
  has_limit = VALUES(has_limit),
  can_spend = VALUES(can_spend),
  sort_order = VALUES(sort_order);
