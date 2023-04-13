$(() => {
    $("#playImg").on("click", () => {
        $("#startSection").hide();
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
            $("#imgContainer").css({ 'background-image': "url(data:image/jpeg;base64," + imageData + ')', 'border': "solid 5px black" })

            $("#imgContainer").draggable({
                axis: "x",
                containment: "window"
            });
        }
        //Richiamata in caso di errori : il mancato scatto di una foto o la mancata selezione
        function cameraError(mesErrore) {
            alert("Errore: " + mesErrore);
        }
    })
})