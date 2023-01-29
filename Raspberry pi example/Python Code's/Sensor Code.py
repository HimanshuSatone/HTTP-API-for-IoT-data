import requests
import RPi.GPIO as GPIO
import time
from  datetime import datetime  

#GPIO SETUP
channel = 4
GPIO.setmode(GPIO.BCM)
#GPIO.setmode(GPIO.BOARD)
#GPIO INPUT
GPIO.setup(channel, GPIO.IN)

headers = {
           'content-type': 'application/x-www-form-urlencoded',
           'x-access-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZDkxODUwZDdmYmE4$
           'userid' : 'ad91850d7fba8bd10aaad41'
          } 
while True :
  if(GPIO.input(4)==False):
     time = datetime.now()
     print("flame detetcted at",time)
     payload1 ={
                'id'         : '5ad91850d7fba8bd10aaad41' ,
                'key'        : 1 ,
                'sensortype' : 'fireSensor',
                'sensorid'   : 12345,
                'status'     : 1,
                'datetime'   : time
              }
     r=requests.post("http://192.168.43.204:3000/users/digital",data=payload1,headers=headers)
     print(r.content)

     payload2 = {
                 'id'              :'5ad91850d7fba8bd10aaad41',
                 'key'             : 1,
                 'Sensortype'      : 'Analog',
                 'sensorid'        : 123,
                 'min_sensor_value': 1,
                 'max_sensor_value': 100,
                 'sensitivity'     : 10,
                 'sensor_value'    : 10,
                 'datetime'        : time
                
             }
     r=requests.post("http://192.168.43.204:3000/users/analog",data = payload2,headers=headers)
     print(r.content)
  else:
    continue
GPIO.cleanup()