from __future__ import print_function

import requests

header = {
           'content-type': 'application/x-www-form-urlencoded', 
           }

params = {
         'email' : 'cc@gmail.com',
         'password' : 'charlie'
         }

url = "http://192.168.43.204:3000/api/auth/login"
resp = requests.post(url,data=params,headers=header)

print(resp.content)