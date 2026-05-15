"""
Crée la base MySQL smartcampus si elle n'existe pas.
Usage : python -m scripts.init_database
"""

import pymysql

from app.config import get_settings

settings = get_settings()


def main() -> None:
  url = settings.database_url
  # mysql+pymysql://root:@localhost:3306/smartcampus?charset=utf8mb4
  if "mysql+pymysql://" not in url:
    print("DATABASE_URL n'est pas MySQL — rien à faire.")
    return

  body = url.split("mysql+pymysql://", 1)[1].split("?", 1)[0]
  user_pass, host_db = body.split("@", 1)
  user, password = user_pass.split(":", 1)
  password = password or ""
  host_port, database = host_db.split("/", 1)
  host, port = host_port.split(":") if ":" in host_port else (host_port, "3306")

  conn = pymysql.connect(
    host=host,
    port=int(port),
    user=user,
    password=password or None,
    charset="utf8mb4",
  )
  try:
    with conn.cursor() as cur:
      cur.execute(
        f"CREATE DATABASE IF NOT EXISTS `{database}` "
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
      )
    conn.commit()
    print(f"Base `{database}` prête.")
  finally:
    conn.close()


if __name__ == "__main__":
  main()
