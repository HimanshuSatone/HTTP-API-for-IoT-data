from __future__ import print_function

import requests

headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZDkxODUwZDdmYmE4YmQxMGFh$
          }

url = "http://192.168.43.204:3000/api/auth/me"
resp = requests.get(url,headers=headers)

print(resp.content)