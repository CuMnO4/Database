import pymysql

def auth_user(username, password):
  try:
    connection = pymysql.connect(host='localhost',
                                 user=username,
                                 password=password,
                                 database='dbcourse',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      cursor.execute('select * from sqlschool.student_info;')
      result = cursor.fetchall()
      print(result)
      return True
  except Exception as e:
    print(f'Error: {e}')
    return False

def create_student_user(username, password):
  try:
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='123456',
                                 database='mysql',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      create_user_query = f"CREATE USER '{username}'@'localhost' IDENTIFIED BY '{password}';"
      cursor.execute(create_user_query)

      grant_privileges_query1 = f"GRANT SELECT ON Pub.* TO '{username}'@'localhost';"
      cursor.execute(grant_privileges_query1)

      # grant_privileges_query2 = f"GRANT SELECT ON sqlschool.* TO '{username}'@'localhost';"
      # cursor.execute(grant_privileges_query2)

      # Create seperate database for each of the user
      create_database_query = f"CREATE DATABASE db_{username};"
      cursor.execute(create_database_query)

      create_record_table_query = f"create table db_{username}.qtable as select * from sqlschool.qtable;"
      cursor.execute(create_record_table_query)

      # create_history_table_query = f"create table db_{username}.historysql as select * from sqlschool.historysql;"
      # cursor.execute(create_record_table_query)

      connection.commit()

      # Grant all privileges on the created database to the created user
      grant_privileges_query3 = f"GRANT ALL PRIVILEGES ON db_{username}.* TO '{username}'@'localhost';"
      cursor.execute(grant_privileges_query3)
      connection.commit()

      # revoke_provilege_query = f"REVOKE ALL PRIVILEGES ON db_{username}.qtable FROM '{username}'@'localhost';"
      # cursor.execute(revoke_provilege_query)
      # connection.commit()

      # grant_privileges_query4 = f"GRANT SELECT ON db_{username}.qtable TO '{username}'@'localhost';"
      # cursor.execute(grant_privileges_query4)
      # connection.commit()

      return True
  except Exception as e:
    print(f'Error: {e}')
    return False
  finally:
    connection.close()

create_student_user('lw', '123456')