# Uptime Monitoring

![ci](https://github.com/mohllal/notifications-be-challenge/actions/workflows/main.yml/badge.svg)


> #### System manages the users's websites to get detailed uptime reports about their availability, average response time, and total uptime/downtime.

* `npm install`  
* `npm start`  

>For unit testing
* `npm run test` 
  
>The server should run on <span style="color:orange; font-weight: bold;">http://locahost:5000</span>

___
![alt text][logo]


[logo]: https://bosta.co/wp-content/uploads/2019/08/bosta_logo_en_red.svg


## Specifications

- [RESTful APIs](./api-server/), a Node.js/Express.js server which handles the users and notifications basic CRUD operations.
  
- RESTful APIs  
  - [RESTful USER APIs](./components/user/user.API.js) User registration(signup, signin, logout, send-otp, verify).
  
  - [RESTful CHECK APIs](./components/check/check.API.js) Check (create, delete, pausse, get, edit).

  - [RESTful CHECK APIs](./components/report/report.API.js)

- Crob Jobs:
  - Handle all new added or removed checks
  
- Notification types:
  - Email
  - Push notifications (pushover)
  


"Highway-Access endpoints"
## Endpoints

>USER

  - `POST /api/user/signup.json` (creating new user...) 
    
    **payload**
      ```json
      {
          "name": "user name",
          "email": "user email",
          "password": "user passowrd"
      }
      ```

   
  ___

- `POST /api/user/login.json` (user login)
  
    **payload**  
    ```json
    {
        "email": "user email",
        "password": "user passowrd"
    }
    ```
___

- `POST /api/user/verification-code.json` (send verification code)  

___

- `POST /api/user/verify.json` (verify otp)
  
    **payload**  
    ```json
    {
        "otp": "code",
    }
    ```
___

- `POST /api/user/logout` (logout)

  
___


>CHECK

  - `POST /api/check` (creating new check...) 
    
    **payload**
      ```json
      {
           "name": "checkName",
            "url": "check url",
            "path": "check path",
            "method": "check method",
            "protocol": "check protocol",
            "interval": "check interval",
            "webhook": "check webhook",
            "tags": "check tags",
            "timeout": "check timeout",
            "threshold": "check threshold",
            "port": "check port",
            "ignoreSSL": "check ignoreSSL"
      }
      ```
 
___

 - `PATCH /api/check/${id}` (update check...) 
    
    **payload**
      ```json
      {
           "name": "checkName",
            "url": "check url",
            "path": "check path",
            "method": "check method",
            "protocol": "check protocol",
            "interval": "check interval",
            "webhook": "check webhook",
            "tags": "check tags",
            "timeout": "check timeout",
            "threshold": "check threshold",
            "port": "check port",
            "ignoreSSL": "check ignoreSSL"
      }
      ```
___

- `GET /api/check/` (get all checks) 
   
    **Query params**

     * <span style="font-weight: 500; color: orange;">`pageNo` : </span> Used for pagination (default 0 if user not provid in request)
     * <span style="font-weight: 500; color: orange;">`limitNo` : </span> (optional with default 50 per request if user not set)
___

- `GET /api/check/tag/${tagName}` (get checks by tagName) 
   
    **`Query params`**

    * <span style="font-weight: 500; color: orange;">`tagName` : </span> (The tagName need to get all checks info)
___

___

- `GET /api/check/${checkId}` (get checks by id) 
   
    **`Query params`**

    * <span style="font-weight: 500; color: orange;">`checkId` : </span> (The check ID need to get all check info)
___

- `GET /api/check/name/${checkName}` (get check by name) 
   
    **`Query params`**

    * <span style="font-weight: 500; color: orange;">`checkName` : </span> (The check Name need to get check info)
___

- `DELETE /api/check/all` (remove all checks) 

___

- `DELETE /api/check/tag/${tagName}` (remove all checks by tagName)
      **`Query params`**

    * <span style="font-weight: 500; color: orange;">`tagName` : </span> (The tagName need to remove all checks info)

___

- `DELETE /api/check/${id}` (remove check by id)
      **`Query params`**

    * <span style="font-weight: 500; color: orange;">`id` : </span> (The id need to remove check info)


## Technologies

- [MongoDB](https://www.mongodb.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Node.js](https://nodejs.org/)
- [Swagger](https://swagger.io/)
- [PushOver](https://pushover.net/)
