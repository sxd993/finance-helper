CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  monthly_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  password_hash VARCHAR(255) NOT NULL,
  distribution_mode ENUM('baseline', 'flex') NOT NULL DEFAULT 'baseline',
  percent_necessary DECIMAL(5,2) NOT NULL DEFAULT 50.0,
  percent_desire DECIMAL(5,2) NOT NULL DEFAULT 30.0,
  percent_saving DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  percent_investment DECIMAL(5,2) NOT NULL DEFAULT 10.0,
  leftover_pool DECIMAL(12,2) NOT NULL DEFAULT 0,
  reset_day TINYINT UNSIGNED NOT NULL DEFAULT 1,
  last_reset_at DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS convert_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  has_limit TINYINT(1) NOT NULL DEFAULT 1,
  accumulates TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO convert_types (code, title, has_limit, accumulates)
VALUES
  ('necessary',   'Необходимые расходы',        1, 0),
  ('desire',      'Желания',                    1, 0),
  ('saving',      'Накопления',                 1, 1),
  ('investment',  'Инвестиции',                 0, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  has_limit = VALUES(has_limit),
  accumulates = VALUES(accumulates),
  updated_at = NOW();

CREATE TABLE IF NOT EXISTS converts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  monthly_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_amount DECIMAL(12,2) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_converts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_converts_types FOREIGN KEY (type_id) REFERENCES convert_types(id) ON DELETE RESTRICT,
  UNIQUE KEY uniq_user_type_name (user_id, type_id, name)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  convert_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_converts FOREIGN KEY (convert_id) REFERENCES converts(id) ON DELETE CASCADE
);

CREATE INDEX idx_converts_user_active ON converts(user_id, is_active);
CREATE INDEX idx_converts_type ON converts(type_id);
