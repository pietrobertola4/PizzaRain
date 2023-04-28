const background = new Audio('../sound/background.mp3');
const point = new Audio('../sound/point.wav');
const game_over_sound = new Audio('../sound/game_over.mp3')

$(() => {
    createTable();

    let player = $("#imgContainer")
    let projectileType = ["orologio", "pizza", "pietra", "petardo"]
    let txtLives = $("#lives")
    let txtPoints = $("#points")
    let points = 0
    let lives = 3;
    let finePartita = false;
    $("#gameSection").hide()
    $("#playImg").on("click", () => {
        background.play()
        background.loop = true; // se voglio mettere una musica di background
        $("#startSection").hide();
        $("#gameSection").show()
        player.hide()
        finePartita = false
        lives = 3;
        points = 0;
        txtLives.text(" ")
        txtPoints.text(" ")
        /*Camera Plugin Code*/
        //Configuro le opzioni di getPicture
        let opzioni = {
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
            quality: 50,

        };
        navigator.camera.getPicture(cameraSuccess, cameraError, opzioni);

        function cameraSuccess(imageData) {
            /*var image = document.getElementById('imgMia'); //<img> nel html
            image.src = "data:image/jpeg;base64," + imageData;*/
            player.css({ 'background-image': "url(data:image/jpeg;base64," + imageData + ')', 'border': "solid 5px black" })

            player.draggable({
                axis: "x",
                containment: "window"
            });

            player.show()

            partita()
        }
        //Richiamata in caso di errori : il mancato scatto di una foto o la mancata selezione
        function cameraError(mesErrore) {
            alert("Errore: " + mesErrore);
        }
    })

    function partita() {
        vite()
        txtPoints.text('Numero punti: ' + points)

        if (lives > 0) {
            creaProiettile();
            let tempoRnd = ((Math.random() * 2) + 1) * 1000
            console.log(tempoRnd);
            setTimeout(partita, tempoRnd)
        }
    }

    let i = 0;

    function creaProiettile() {
        let type = Math.floor(Math.random() * 4)
        console.log(type);
        let projectile = $("<div id='" + i + "'>").addClass("projectile " + projectileType[type]).appendTo("#gameSection")
        i++

        let projectilePosition = Math.floor(Math.random() * 70)
        projectile.css('left', projectilePosition + '%')

        let controlloCollisione = setInterval(() => {
            vite()
            txtPoints.text('Numero punti: ' + points)

            if (recthit(projectile, "#imgContainer")) {
                console.log("toccato");
                if (projectile.hasClass('orologio') || projectile.hasClass('pizza')) {
                    point.play()
                    if (projectile.hasClass('orologio')) {
                        points += 5
                    } else {
                        points += 10
                    }
                } else {
                    lives--
                    if (lives <= 0) {
                        gameOver()
                    }
                }
                projectile.remove()
                console.log(projectile.attr('id'));
                clearInterval(controlloCollisione)
            }
            else {
                if (projectile.offset().top > (player.offset().top + player.outerHeight())) {
                    console.log('fondo');
                    projectile.remove()
                    clearInterval(controlloCollisione)
                }
            }
        }, 200);
    }

    function vite() {
        txtLives.html(' ')
        for (let i = 0; i < lives; i++) {
            txtLives.append('<img class="vita" src="img/heart.png">')
        }
    }

    function gameOver() {
        game_over_sound.play()
        navigator.vibrate(500)
        console.log("vrrrrr")
        player.hide()
        $("#gameSection").hide()
        $("#score").text(points)
        $("#gameOverModal").modal('show')
        $("#nameWarning").hide()

    }

    $("#btnEnd").on("click", () => {
        if (!$("#txtNome").val()) {
            $("#nameWarning").show()
        } else {
            console.log($("#txtNome").val().toString());
            let data = { "username": $("#txtNome").val().toString(), "point": points }
            sendRequest("https://pietrobertola.altervista.org/NAPOLI/insertPoints.php?username=" + $("#txtNome").val().toString() + "&punteggio=" + points, "GET", "", (serverData) => {
                $("#gameOverModal").modal('hide')
                $("#gameSection").hide();
                $("#startSection").show()
            })

        }

    })

    function recthit(rectone, recttwo) {

        var r1 = rectone;
        var r2 = $(recttwo);

        var r1x = r1.offset().left;
        var r1w = r1.width();
        var r1y = r1.offset().top;
        var r1h = r1.height();

        var r2x = r2.offset().left;
        var r2w = r2.width();
        var r2y = r2.offset().top;
        var r2h = r2.height();

        if (r1y + r1h < r2y || r1y > r2y + r2h || r1x > r2x + r2w || r1x + r1w < r2x) {
            return false;
        } else {
            return true;
        }

    }


})

function createTable() {
    let rq = sendRequestNoCallback("https://pietrobertola.altervista.org/NAPOLI/ViewClassifica.php", "GET");
    rq.fail(function (jqXHR) {
        error(jqXHR);
    });
    rq.done(function (serverData) {
        $(".tableScore").html("");

        let tr1 = $("<tr class='p-3' style='background-color:red'></tr>");
        let th = $("<th></th>");
        let th1 = $("<th>USERNAME</th>");
        let th2 = $("<th>SCORE</th>");
        th.appendTo(tr1);
        th1.appendTo(tr1);
        th2.appendTo(tr1);
        tr1.appendTo($(".tableScore"));
        let tr;
        let td;
        for(let i = 0; i < 5; i ++) {
            tr = $("<tr class='p-3' style='background-color:black;opacity:0.5'></tr>");
            td = $("<td style='color:red;'>" + (i+1) + "</td>")
            td.appendTo(tr);
            td = $("<td>" + serverData[i].username + "</td>")
            td.appendTo(tr);
            td = $("<td>" + serverData[i].top + "</td>")
            td.appendTo(tr);
            tr.appendTo($(".tableScore"));
        }   
        
    });
}