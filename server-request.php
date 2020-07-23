<?php
define('API_KEY', '24a15793cd1e22fbb9299b7d585debe1');

$data = json_decode( file_get_contents('php://input'), true );

if ( !empty($data) ) {
  $url = $data['url'];
  unset($data['url']);

  $data['token'] = API_KEY;
  $data['depart_date'] = date( 'Y-m-d', strtotime($data['depart_date']) );

  $response = sendAPIRequest($url, $data);
  echo $response;
} else {
  echo '0';
}


function sendAPIRequest(string $url, array $data): string
{
  $queryString = "?origin={$data['origin']}&destination={$data['destination']}&depart_date={$data['depart_date']}&token=".API_KEY;
    
  $ch = curl_init($url . $queryString);

  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_HTTPGET, TRUE);

  $response = curl_exec($ch);

  curl_close($ch);

  return $response;
}
