$(() => {
    let player = $("#imgContainer")
    let finePartita = false;
    $("#gameSection").hide()
    $("#playImg").on("click", () => {
        $("#startSection").hide();
        $("#gameSection").show()
        /*Camera Plugin Code*/
        //Configuro le opzioni di getPicture
        let opzioni = {
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
            quality: 50
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
            
            partita()
        }
        //Richiamata in caso di errori : il mancato scatto di una foto o la mancata selezione
        function cameraError(mesErrore) {
            alert("Errore: " + mesErrore);
        }
    })

    function partita(){
        if (!finePartita){
            creaProiettile();
            let tempoRnd = ((Math.random() * 2) + 1)*1000
            console.log(tempoRnd);
            setTimeout(partita,tempoRnd)
        }else{
            alert('FINITO')
        }
    }

    function creaProiettile() {
        let projectile = $("<div>").addClass("projectile orologio").appendTo("#gameSection")

        let projectilePosition = Math.floor(Math.random() * 70)
        projectile.css('left', projectilePosition + '%')

        controlloCollisione = setInterval(() => {
            if (recthit(projectile, "#imgContainer")) {
                console.log("toccato");
                projectile.addClass("paused")
                finePartita = true;
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