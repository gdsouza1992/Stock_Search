<?php


include('DBcredentials.php');
 
$success =false;

$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$removeFavoriteCode = $data_back->{"favouriteCode"};
$token = $data_back->{"token"};


$sql = "DELETE FROM Favorites WHERE Favorites.favoriteValue='{$removeFavoriteCode}' AND Favorites.userID = (SELECT Users.userID FROM Users WHERE Users.emailID = '{$emailId}');";

$result = mysqli_query($conn,$sql);
if(mysqli_affected_rows($conn) > 0){
    $success = true;
}

if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite removed.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite not removed.',
        "responseStatus" => 'FAILURE',
        "authenticated" => 0,
        "token" => $token
            )
        )
    );
}

echo $json;
$conn->close();
?>