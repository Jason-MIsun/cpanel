
//全局变量 server 设定
global.server = {}

server.USE_GZIP = true

// 请求参数设定
server.HTTPS = true
server.session_max_age = 240
server.REQUEST_EXPIRE_TIME = 1000
server.ACCESS_TOKEN_LENGTH = 64
server.ACCESS_TOKEN_REQUEST_EXPIRE_TIME = 1000

// Session Key RSA 证书及其密匙
server.PRIVATE_KEY = "MIICXAIBAAKBgQDkQotZPFgltAiMls7xSZUD/GXR7DBMUvULErp/mldwQAUGBSEy\nkK61Y1h0dCktLju0/vd++i+WMpiiTMe2Y/1wFou/fnG+uKNtCZErDSBHgQVn1+pA\nn5zmVhkilsUjiyVGWf5iF9DCqy1ubLr2obiD8gjOqspG/mkZT5z5JHYskQIDAQAB\nAoGAJ5HFmF2WpkqUZNLL4xYvZ/Z8LCz2nnSPGDFR9UbrO4FNnaKMA7kDIFyte9qb\nPMLUBOdiPjfewfnZbeFDicHBsDXYqzSY04DUbg8is4ftTRiq/xa8oj4iVzB5CdgX\n/oZrHjdI/6qWRRAyU0z9UnLwYbeUcDQicWw0pQyQIR7mxHECQQDyOwHDVk9hcUXd\nQQuNzMiD27GIBbZy/9sWpzOpsZlLl/AwJFYceuOqXUqK6r+W8P3zSJhXwgSKXkbA\nopRBr2NdAkEA8Tw8F1uEZPcYjw8ZgwxEmyQsqaBVBgvD0ltHv8QBnrfMI2zIxkVo\nPhg8O8B/3RX4Jjm9ILN0WYqrmAhN4PQuxQJALD3+ynC/Our3ebvholqe3QaJXHC+\nrC5zE6YiV4Iqn5X2trRMThNb9cfoT4skxyrpF0BRIuY68hLaFWEcdwrTuQJBAJVk\noios6N7GD5V42mnHzSzuyCH8QutNmeXJ1bMypXYviOJfWi8/iID77UFrw0OdeWHi\n2/dGa0WQlRe//MrVLakCQBVnXM3tY+GVFmJVWyxvGQMqjm9WN0fygibjwUO2cVW2\n5DlClueaWE8l/n4U0iLUCv9liIAFAMm4f76DqFxd5Tc="

server.PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDkQotZPFgltAiMls7xSZUD/GXR\n7DBMUvULErp/mldwQAUGBSEykK61Y1h0dCktLju0/vd++i+WMpiiTMe2Y/1wFou/\nfnG+uKNtCZErDSBHgQVn1+pAn5zmVhkilsUjiyVGWf5iF9DCqy1ubLr2obiD8gjO\nqspG/mkZT5z5JHYskQIDAQAB"

// APP status setting
server.CFG = {}

// 路径配置
server.path = {}
server.path.APP_STORED_LOG_PATH = './logs/App/'
server.path.HTTP_STORED_LOG_PATH = './logs/Http/'
server.path.DATABSASE_STORED_LOG_PATH = './logs/Database/'
server.path.LOGIN_CENTER_DB_PATH = './database/LoinCenter.json'
server.path.USER_PROFILE_DB_PATH = './database/UserProfile.json'
server.path.SESSION_STORE_DB_PATH = './database/Session.json'
server.path.STATUS_CENTER_DB_PATH = './database/Status.json'
server.path.APP_DEFAULT_LOG_PATH = './logs/AppCurrent.log'
server.path.HTTP_DEFAULT_LOG_PATH = './logs/HttpCurrent.log'
server.path.DATABASE_DEAFAULT_LOG_PATH = './logs/DatabaseCurrent.log'