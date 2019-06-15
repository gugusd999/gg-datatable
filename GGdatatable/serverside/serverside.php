<?php

class Database {
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $db = "datatable";
    public function getDepartment(){
        return mysqli_connect($this->host, $this->user, $this->pass, $this->db);
    }
    // query data ke database
    public function query($e)
    {
        $conn = $this->getDepartment();
        $query = mysqli_query($conn, $e);
        return $query;
    }

    // ambuil data secara objek
    public function query_result_object($e)
    {
        $conn = $this->getDepartment();
        $query = mysqli_query($conn, $e);
        $box = [];
        while ($data = mysqli_fetch_object($query) ) {
            $box[] = $data;
        }
        return $box;
    }

    // ambil data secara arrray 
    public function query_result_assoc($e)
    {
        $conn = $this->getDepartment();
        $query = mysqli_query($conn, $e);
        $box = [];
        while ($data = mysqli_fetch_assoc($query) ) {
            $box[] = $data;
        }
        return $box;
    }
    // hitung total query data
    public function count_query($e)
    {
        $conn = $this->getDepartment();
        $query = mysqli_query($conn, $e);
        $box = [];
        while ($data = mysqli_fetch_object($query) ) {
            $box[] = $data;
        }
        return count($box);
    }
}


$user = new Database();

// plugin dimuali di kode ini
$where = "";
if (isset($_POST["search"])) {
    $where = " WHERE ";
}
// untuk melakukan pencarian data
if (isset($_POST["search"])) {
    $search = "
        data1 LIKE '%".$_POST["search"]."%'
        OR data2 LIKE '%".$_POST["search"]."%'
        OR data3 LIKE '%".$_POST["search"]."%'
        OR data4 LIKE '%".$_POST["search"]."%'
    ";
    $where .= $search;
}

// limit data
$limit="";
$startnumber = 0;
if (isset($_POST["limit"])) {
    $startnumber += $_POST["limit"]*10;
    $limit = " LIMIT ".($_POST["limit"]*10).", 10";
}else{
    $limit = " LIMIT 0, 10";
}


// hitung banyak data;
$totalData = $user->count_query("SELECT * FROM datatable ".$where);
// ambil datanya
$db = $user->query_result_object("SELECT * FROM datatable ".$where.$limit);
// ini adalah kotak kosong untuk data
$data = "";
// data diisi disini
foreach ( $db as $key => $value) {
    $data .= "
        <tr>
            <td>".($key + 1 + $startnumber)."</td>
            <td>".$value->data1."</td>
            <td>".$value->data2."</td>
            <td>".$value->data3."</td>
            <td>".$value->data4."</td>
        </tr>
    ";
}
// setting data
$http_request = [
    "totaldata" => $totalData,
    "data" => $data
];

// tampilkan data ke dalam json
echo json_encode($http_request);





