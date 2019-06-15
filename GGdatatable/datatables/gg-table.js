$(document).ready(function () {
    $("<div class='gg-table-head'><input type='search' placeholder='search...'/><div>").insertBefore(".gg-table table");
    $("<div class='gg-table-footer'><div>").insertAfter(".gg-table table");
});

(function($) {
    $.fn.Pagination = function( e ,start = 0, pencarian="", batasPagin = 10 ){

        // simpan start pagin dalma session
        var batasPagination = Number(start)+batasPagin;
        var dataPerHalaman = 10; 
        var halaman = sessionStorage.getItem(e.initial+"Total");
        // buat total halaman
        var totalHalaman = Number(halaman/dataPerHalaman);
        
        // pembulatan ke atas dengan Math.ceil
        totalHalaman = Math.ceil(totalHalaman);

        var lewatbatas = Number(start)+batasPagin;

        var pagin = "<ul>";
        
            if (start != 0 || start > 0) {
                pagin += "<li><a class='PGprev'>&laquo;</a></li>";
            }else{
                pagin += "<li><a>&laquo;</a></li>";
            }

            for(i=0; i < totalHalaman ; i++){
                if(i>= start && i < batasPagination){
                    pagin += "<li><a class='PG' page='"+i+"'>"+(Number(i)+1)+"</a></li>";
                }
            }
            if (lewatbatas > totalHalaman) {
                pagin += "<li><a>&raquo;</a></li>";
            }else{
                pagin += "<li><a class='PGnext'>&raquo;</a></li>";
            }

        pagin += "</ul>";

        $(e.target+" .gg-table-footer").html(pagin);
        // pencarian
        $(e.target+" .PG").attr("pencarian", pencarian);
        
        $(document).PGprev(e, pencarian);
        $(document).PGnext(e, pencarian);
        $(document).PG(e);
    }
}(jQuery));

(function($) {
    $.fn.PGprev = function(e, cari=""){
        $(e.target+" .PGprev").click(function() {
           // dapatkan data dari sesion pagination start
            var sebelumnya = sessionStorage.getItem(e.initial+"StartP");
            // tambahkan dengan abanyak pagin 1 halaman (disini pake 10);
            var sesudahnya = Number(sebelumnya)-10;
            // panggil pagination
            $(document).Pagination(e, sesudahnya, cari);
            // update session pagination start
            sessionStorage.setItem(e.initial+"StartP", sesudahnya); 
        });
    }
}(jQuery));

(function($) {
    $.fn.PGnext = function(e, cari=""){
        $(e.target+" .PGnext").click(function() {
            // dapatkan data dari sesion pagination start
            var sebelumnya = sessionStorage.getItem(e.initial+"StartP");
            // tambahkan dengan abanyak pagin 1 halaman (disini pake 10);
            var sesudahnya = Number(sebelumnya)+10;
            // panggil pagination
            $(document).Pagination(e, sesudahnya, cari);
            // update session pagination start
            sessionStorage.setItem(e.initial+"StartP", sesudahnya);
        });
    }
}(jQuery));

(function($) {
    $.fn.PG = function(e){
        $(e.target+" .PG").click(function() {

            $(e.target+" .PG").removeClass('active');
            $(this).addClass('active')

            var noPage = $(this).attr('page');
            var pencarian = $(this).attr('pencarian');
            $.ajax({
                url: e.url,
                method: e.method,
                dataType: "text",
                data:{
                    search : pencarian,
                    limit: noPage
                },success: function (response) {
                    var server = JSON.parse(response);
                    sessionStorage.setItem(e.initial+"Total", server.totaldata);
                    $(e.target+" tbody").html(server.data);
                }
            });

        });
    }


}(jQuery));

(function($){
    $.fn.GGtable = function(e){

        // dapatkan nilai awal tampilan
        
        $(document).ready(function () {

            // setting awal saat halaman dimuat
            sessionStorage.setItem(e.initial+"StartP", 0);

            $.ajax({
                url: e.url,
                success: function (response) {
                    var server = JSON.parse(response);
                    $(e.target+" tbody").html(server.data);
                    sessionStorage.setItem(e.initial+"Total", server.totaldata);
                    $(document).Pagination(e);
                }
            });
        });

        // seacrh
        $(e.target+" input[type=search]").keyup(function () { 
            // reset kembali ke 0
            sessionStorage.setItem(e.initial+"StartP", 0);

            var text = $(this).val();
            $.ajax({
                url: e.url,
                method: e.method,
                dataType: "text",
                data:{
                    search : text
                },success: function (response) {
                    var server = JSON.parse(response);
                    sessionStorage.setItem(e.initial+"Total", server.totaldata);
                    $(e.target+" tbody").html(server.data);
                    $(document).Pagination(e, 0, text);
                    $(e.target+" .PG").attr("pencarian", text);
                }
            });
        });
    };
}(jQuery));

            