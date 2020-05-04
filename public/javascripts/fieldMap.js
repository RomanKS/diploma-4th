let fieldJson = {
    "dc8d7380-87a6-11ea-a291-c7c9efb4ebe5":"field1",
    "8b077b70-87c2-11ea-a63e-c330d02c972b":"field2",
    "8b0a88b0-87c2-11ea-a63e-c330d02c972b":"field3",
    "8b0b4c00-87c2-11ea-a63e-c330d02c972b":"field4",
    "8b0be840-87c2-11ea-a63e-c330d02c972b":"field5",
    "8b0c8480-87c2-11ea-a63e-c330d02c972b":"field6",
    "8b0cd2a0-87c2-11ea-a63e-c330d02c972b":"field7",
    "8b0d6ee0-87c2-11ea-a63e-c330d02c972b":"field8",
    "8b0de410-87c2-11ea-a63e-c330d02c972b":"field9"
};

let watering = (fieldNumber, enableWatering) => {
    let color  = enableWatering ? 'blue' : 'black';
    let common = (fieldNumber, color) => {
        $(`.field-${fieldNumber}-tap`).css('background-color', color);
        $(`.field-${fieldNumber}-vertical`).css('border-color', color);
        $(`.field-${fieldNumber}`).css('border-color', color);
    };

    if (fieldNumber) {
        if (fieldNumber <= 3) {
            $('.pump-tap').css('background-color', color);
            $('.highway-row-1').css('border-color', color);

            common(fieldNumber, color);
        } else if (fieldNumber > 3 && fieldNumber <= 6) {
            $('.pump-tap').css('background-color', color);
            $('.highway-row-1').css('border-color', color);
            $('.highway-row-2').css('border-color', color);

            common(fieldNumber, color);
        } else if (fieldNumber > 6 && fieldNumber <= 9) {
            $('.pump-tap').css('background-color', color);
            $('.highway-row-1').css('border-color', color);
            $('.highway-row-2').css('border-color', color);
            $('.highway-row-3').css('border-color', color);

            common(fieldNumber, color);
        }
    }
};

$( document ).ready(function() {
    watering(7, true);
    //setTimeout(() => window.location.reload(), 3000);


    $.get("https://diploma-4th.herokuapp.com/fieldmap/getfielddata", (response, status) => {
         let fieldsDataArray   = JSON.parse(response.fieldsData),
             wateringData      = JSON.parse(response.wateringData),
             humidityDataArray = JSON.parse(response.humidityData),
             humiditySlice     = null,
             watering          = null;

        $('.field').each(function (i, elem) {
            humiditySlice = humidityDataArray.find(el => {
                return el.FK_Field == $(elem).data('uuid');
            });

            $(elem).find('.field-info .field-number').html(fieldsDataArray.find(el => {
                return el.ID == $(elem).data('uuid');
            }).Number);
            $(elem).find('.field-info .field-name').html(fieldsDataArray.find(el => {
                return el.ID == $(elem).data('uuid');
            }).Name);

            if (humiditySlice) {
                $(elem).find('.field-info .field-humidity-slice').html(humiditySlice.Humidity + " %");
            }

            if (wateringData && wateringData.FK_Field == $(elem).data('uuid')) {
                if (wateringData.StartDate && wateringData.EndDate) {
                    $(elem).find('.field-info .field-start-watering').html(new Date(wateringData.StartDate).toLocaleString());
                    $(elem).find('.field-info .field-end-watering').html(new Date(wateringData.EndDate).toLocaleString());
                } else if (wateringData.Humidity) {
                    $(elem).find('.field-info .field-final-humidity').html(new Date(wateringData.Humidity).toLocaleString());
                }
            }
        });
    });

    // $.post("http://localhost:3000/fieldmap/inprogresswatering", {}, (res, status) => {
    //     res = JSON.parse(res);
    //     let fk_field         = res['FK_Field'],
    //         activeFieldClass = null;
    //
    //     if (fk_field) {
    //         activeFieldClass = fieldJson[fk_field];
    //
    //         if (activeFieldClass) {
    //             //$('.' + activeFieldClass).
    //         }
    //     }
    // });

});