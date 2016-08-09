<?php
require 'phpmailer/PHPMailerAutoload.php';
$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'gareth.dsouza2192@gmail.com';                 // SMTP username
$mail->Password = 'pratu&dada16';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom('no-reply@stocksearch.com', 'Stock Confirmation');
//$mail->setFrom('test@loop.com', 'Loop');
$mail->addAddress($sendToEmail, 'Stock user');     // Add a recipient
//$mail->addAddress('carina.round21@gmail.com','TEST REPORT');     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
$mail->addCC('carina.round21@gmail.com');
//$mail->addBCC('bcc@example.com');

//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments


//$mail->AddAttachment('/var/www/html/loop/xls/Report.xlsx');
//$mail->addAttachment('attachments/gareth.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML


 
$mail->Subject = 'Your confirmation link';

$mail->Body    = 'Click here to confirm verification.'.$confirmationLink;
$mail->AltBody = 'Welcome to Stocks';

if(!$mail->send()) {
//    echo "Error in message";
    $success = false; 
} else {
//    echo "Message sent";
    $success = true;
}



?>