const defConfig = {
  swagger_path: 'doc',
  swagger_title: '会议室预定系统接口文档',
  swagger_description: '会议室预定系统接口文档',
  version: '1.0',
  prefix: '/api',

  redis_server_host: '127.0.0.1',
  redis_server_port: 6379,
  redis_server_db: 1,

  nodemailer_host: 'smtp.qq.com',
  nodemailer_port: 587,
  nodemailer_auth_user: '495174699@qq.com',
  nodemailer_auth_pass: 'dondtvynuwmlcahj',

  mysql_server_host: '127.0.0.1',
  mysql_server_port: 3306,
  mysql_server_username: 'root',
  mysql_server_password: '123456',
  mysql_server_database: 'meeting_room_booking_system',

  nest_server_port: 3000,

  jwt_secret: 'abvdc',
  jwt_access_token_expires_time: '30m',
  jwt_refresh_token_expres_time: '7d',
};

export default () => defConfig;
