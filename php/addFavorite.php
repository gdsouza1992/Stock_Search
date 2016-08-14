<?php


include('DBcredentials.php');
 
$success =false;

$data_back = json_decode(file_get_contents('php://input'));
$emailId = $data_back->{"emailId"};
$newFavoriteCode = $data_back->{"favouriteCode"};
$token = $data_back->{"token"};


$sql = "SELECT Favorites.favoriteValue FROM Favorites WHERE userID = (SELECT Users.userID FROM Users WHERE Users.emailID = '{$emailId}') AND Favorites.favoriteValue = '{$newFavoriteCode}'";

$result = mysqli_query($conn,$sql);
//Check if favorite is already in the list
if($result->num_rows == 1){
    while($row = $result->fetch_assoc()) {
        //Compare new and existing values
        if($row['favoriteValue'] == $newFavoriteCode){
            $success = false;
        }
    }
}else{
    $sql2 = "INSERT INTO `Favorites`(`userID`, `favoriteValue`) VALUES ((SELECT Users.userID FROM Users WHERE Users.emailID = '{$emailId}'),'{$newFavoriteCode}')";
    $result = mysqli_query($conn,$sql2);
    if(mysqli_affected_rows($conn) > 0){
        $success = true;
    }
}

if($success){
   $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite added.',
        "responseStatus" => 'SUCCESS',
        "authenticated" => 1,
        "token" => $token
            )
        )
    );
}else{
    $json = json_encode(array(
     "response" => array(
        "responseText" => 'Favorite not added.',
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