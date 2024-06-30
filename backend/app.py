from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import jwt
import pymysql
from functools import wraps
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asduabwdyuwhabducasgvawdbhuawd'
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/test', methods=['GET'])
def test():
  return jsonify({'message': 'Your message has reach the server.'}), 200

# Authenticate user related logic

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = request.headers.get('Authorization')
    if not token:
      return jsonify({'message': 'Token is missing!'}), 403
    try:
      token = token.split(' ')[1]
      data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
      current_user = data['username']
      current_password = data['password']
    except:
      return jsonify({'message': 'Token is invalid!'}), 403
    return f(current_user, current_password, *args, **kwargs)
  return decorated

def auth_user(username, password):
  try:
    connection = pymysql.connect(host='localhost',
                                 user=username,
                                 password=password,
                                 database=f'db_{username}',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      connection.close()
      return True
  except Exception as e:
    print(f'Error: {e}')
    return False

@app.route('/login', methods=['POST'])
def login():
  username = request.form.get('username')
  password = request.form.get('password')
  print(f'username={username}, password={password}')
  user_valid = auth_user(username, password)
  if user_valid:
    token = jwt.encode({
      'username': username,
      'password': password,
      'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({'status': 'Logged in successfully', 'token': token}), 200
  else:
    return jsonify({'status': 'Invalid username or password'}), 401

# The actual api, protected by jwt token

@app.route('/test_protected', methods=['GET'])
@token_required
def test_protected(current_user, current_password):
  return jsonify({'message': f'Hello, {current_user}, this is the protected route!'})

# Execute the sql statement transfered from frontend
@app.route('/performSQLQuery', methods=['POST'])
@token_required
def perform_sql_query(current_user, current_password):
  sql = request.json['sql']
  commit = request.json['commit']
  try:
    connection = pymysql.connect(host='localhost',
                                 user=current_user,
                                 password=current_password,
                                 database=f'db_{current_user}',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      cursor.execute(sql)
      if commit == 1:
        connection.commit()
      result = cursor.fetchall()
      affected_rows = cursor.rowcount
      return jsonify({'result': result, 'affected_rows': affected_rows}), 200
  except Exception as e:
    print(f'Error: {e}')
    return jsonify({'message': 'sql query failed!', 'status': str(e)}), 401
  finally:
    connection.close()

@app.route('/submit', methods=["POST"])
@token_required
def handle_submit(current_username, current_password):
  # compare the table that keeps the answer in db_{username} and sqlschool
  # if the result is correct, give full marks to the specified user
  tid = request.json['tid']
  try:
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='123456',
                                 database='mysql',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      sql = f"select * from sqlschool.qtable where tid={tid}"
      cursor.execute(sql)

      result = cursor.fetchall()[0]
      sql_result_table = result['ttable']
      user_result_table = f"db_{current_username}.{sql_result_table.split('.')[1]}"
      sql = f"select * from {user_result_table} except select * from {sql_result_table}"
      cursor.execute(sql)

      result = cursor.fetchall()
      user_minus_result = len(result)

      # rows from the answer
      sql = f"select * from {sql_result_table}"
      cursor.execute(sql)
      result = cursor.fetchall()
      result_rows = len(result)
      
      # rows from the user
      sql = f"select * from {user_result_table}"
      cursor.execute(sql)
      result = cursor.fetchall()
      user_rows = len(result)

      if user_minus_result == 0 and result_rows == user_rows:
        # all the results are correct
        # update the score of the user
        sql = f"update db_{current_username}.qtable set tuscore=tscore where tid={tid}"
        cursor.execute(sql)
        connection.commit()

      return jsonify({'wrong_rows': user_minus_result, 'fewer_rows': result_rows-user_rows}), 200

  except Exception as e:
    print(f'Error: {e}')
    return jsonify({'message': str(e)}), 401
  finally:
    connection.close()

# Run the app
if __name__ == '__main__':
  app.run(debug=True, port=6006)
