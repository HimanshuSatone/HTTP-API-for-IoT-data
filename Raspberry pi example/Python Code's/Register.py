
from __future__ import print_function

import requests

headers = {
    'content-type': 'application/x-www-form-urlencoded',
}

params = {
         'name' : 'Charlie Chaplin',
         'email' : 'cc@gmail.com',
         'password' : 'charlie'
         }

url = "http://192.168.43.204:3000/api/auth/register"
resp = requests.post(url, data=params, headers=headers)

print(resp.content)

