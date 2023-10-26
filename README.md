# Full-Stack Application Deployment Guide

This guide provides step-by-step instructions for deploying a full-stack application on AWS cloud, including configuring an NGINX server. This deployment allows you to host your application on a single server.

## Prerequisites

Before you begin, you should have the following:

- An AWS account with RDS MySQL, EC2(local machine can be used instead), and security groups set up.
- The [Full-Stack MERN Deployment Repository](https://github.com/shamim-iq/fullstack-mern-nginx-deployment).
- Basic knowledge of AWS services and the command line.

## Deployment Steps

1. **Create an RDS MySQL Database and an EC2 Instance**:

   - Create an RDS MySQL database in your AWS account.
   - Launch an EC2 instance according to your preferences.

2. **Clone the Project Repository**:

   - Clone the project repository from GitHub using the following command:
     ```
     git clone https://github.com/shamim-iq/fullstack-mern-nginx-deployment.git
     ```

3. **Navigate to the Project Directory**:

   - Change your current directory to the project directory:
     ```
     cd fullstack-mern-nginx-deployment
     ```

4. **Install Required Software**:

   - Install Node.js, npm, and MySQL on your EC2 instance.

5. **Edit the Server Configuration**:

   - Navigate to the `/server` directory and edit the `server.js` file to configure the MySQL database connection with your RDS instance.
     ```
     const db = mysql.createConnection({
     host: '<RDS_Endpoint>',
     port: '3306',
     user: '<username>',
     password: '<password>',
     database: '<db_name>',
     });
     ```

6. **Connect to RDS MySQL**:

   - Connect to your RDS MySQL database using the MySQL command-line client:
     ```
     mysql -h <RDS_Endpoint> -P 3306 -u <user_name> -p
     ```

7. **Select Database**:

   - Select the database you want to use:
     ```
     use <db_name>
     ```

8. **Create a Table**:

   - Create a table named "users" with two columns: "username" and "password".
     ```
     CREATE TABLE users (username VARCHAR(20), password VARCHAR(20));
     ```

9. **Edit Client Configuration**:

   - Navigate to the `/client` directory and add a "proxy" line in the `package.json` file to specify the backend server's URL:
     ```
     "proxy": "http://<instance_public_ip>:3001/"
     ```

10. **Start the Frontend**:
    - Navigate to the `/client` directory and run the following command to start the frontend application on port 3000:
      ```
      npm start &
      ```

11. **Start the Backend**:

    - Navigate to the `/server` directory and run the following command to start the backend server on port 3001:
      ```
      npm run dev &
      ```

12. **Check Both Ends**:

    - Open a web browser and access `<instance_ip>:3000` to verify that both the frontend and backend are working correctly.

13. **Install NGINX and Configure Firewall**:

    - Install NGINX on your EC2 instance and ensure that the necessary ports are allowed on the firewall.

14. **Edit NGINX Configuration**:

    - Use a text editor to edit the NGINX configuration file:
      ```
      sudo nano /etc/nginx/sites-available/default
      ```

15. **NGINX Configuration**:

    - Edit the file with the following configuration, replacing `<instance_public_ip>` with your instance's public IP address:
      ```
      server_name <instance_public_ip>;

      location / {
      proxy_pass http://<instance_public_ip>:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      }
      ```
16. **Remove Default NGINX Configuration**:

    - Remove the default NGINX configuration file from the enabled sites:
      ```
      sudo rm /etc/nginx/sites-enabled/default
      ```

17. **Enable Custom Configuration**:

    - Create a symbolic link to enable your custom NGINX configuration:
      ```
      sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
      ```

18. **Test NGINX Configuration**:

    - Verify that your NGINX configuration is correct without syntax errors:
      ```
      sudo nginx -t
      ```

19. **Reload NGINX**:

    - Reload NGINX to apply the new configuration:
      ```
      sudo service nginx reload
      ```

20. **Access the Application**:

    - Access the application on your EC2 instance's public IP address without specifying a port.

## Conclusion

Following these steps will enable you to deploy a full-stack application with NGINX on AWS. Remember to replace placeholders like `<instance_public_ip>`, `<RDS_Endpoint>`, `<user_name>`, and `<db_name>` with your specific configuration details. You can now access your application via your EC2 instance's public IP address.

