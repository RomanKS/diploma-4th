let express            = require('express'),
    router             = express.Router(),
    models             = require('../models'),
    FieldModel         = models.Field,
    TapModel           = models.Tap,
    TapToFieldModel    = models.TapToField,
    Error              = require('../common/Error/Error'),
    log                = new Error(`'Field' route`);

router.post('/addfield', async (req, res, next) => {
   let body  = req.body,
       name  = body.name ? body.name.trim() : null,
       field = null;

   if (name) {
      field = await FieldModel.findOne({
         where: {
            Name: name
         }
      });

      if (field) {
         log.setDescription(`the field, with name: ${name}, already exist`);
         log.setFunctionName(`rout name is: 'addfield'`);

         res.json({response: log.getErrorJson()});
         return;
      } else {
         field = await FieldModel.create({
            Name: name
         });

         if (!field) {
            log.setDescription(`the new field, with name: ${name}, wasn't created`);
            log.setFunctionName(`rout name is: 'addfield'`);

            res.json({response: log.getErrorJson()});
            return;
         }
      }
   } else {
      log.setDescription(`field name is not send`);
      log.setFunctionName(`Rout name is: 'addfield'`);

      res.json({response: log.getErrorJson()});
      return;
   }

   res.json({response: field});
});

router.post('/addtap', async (req, res, next) => {
   let body          = req.body,
       name          = body.name ? body.name.trim() : null,
       controllerId  = body.controllerId ? body.controllerId.trim() : null,
       tap           = null;

   if (name && controllerId) {
      tap = await TapModel.findOne({
         where: {
            Name: name
         }
      });

      if (tap) {
         log.setDescription(`the tap, with 'name': ${name} already exist`);
         log.setFunctionName(`rout name is: 'addtap'`);

         res.json({response: log.getErrorJson()});
         return;
      } else {
         tap = await TapModel.create({
            Name: name,
            ControllerID: controllerId
         });

         if (!tap) {
            log.setDescription(`the new tap, with 'name': ${name}, wasn't created`);
            log.setFunctionName(`rout name is: 'addtap'`);

            res.json({response: log.getErrorJson()});
            return;
         }
      }
   } else {
      log.setDescription(`tap name is not send`);
      log.setFunctionName(`Rout name is: 'addtap'`);

      res.json({response: log.getErrorJson()});
      return;
   }

   res.json({response: tap});
});

router.post('/taptofield', async (req, res, next) => {
   let body       = req.body,
       fk_field   = body.fk_field ? body.fk_field.trim() : null,
       fk_tap     = body.fk_tap ? body.fk_tap.trim() : null,
       taptofield = null,
       tap        = null,
       field      = null;

   if (fk_field && fk_tap) {
      tap = TapModel.findOne({
         where: {
            ID: fk_tap
         }
      });

      field = FieldModel.findOne({
         where: {
            ID: fk_field
         }
      });

      [tap, field] = await Promise.all([tap, field]);

      if (field && tap) {
         taptofield = await TapToFieldModel.create({
            FK_Tap: fk_tap,
            FK_Field: fk_field
         });

         if (!taptofield) {
            log.setDescription(`the new taptofield record, with 'fr_tap': ${fk_tap}, 'fk_field': ${fk_field} wasn't created`);
            log.setFunctionName(`rout name is: 'taptofield'`);

            res.json({response: log.getErrorJson()});
            return;
         }
      } else {
         log.setDescription(`the DB can't find 'tap' with ID: ${fk_tap} or|and can't find 'field' with ID: ${fk_field}`);
         log.setFunctionName(`rout name is: 'taptofield'`);

         res.json({response: log.getErrorJson()});
         return;
      }
   } else {
      log.setDescription(`fk_tap or|and fk_field is not send`);
      log.setFunctionName(`Rout name is: 'taptofield'`);

      res.json({response: log.getErrorJson()});
      return;
   }

   res.json({response: taptofield});
});

module.exports = router;
