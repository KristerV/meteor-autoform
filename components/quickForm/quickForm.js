/* global AutoForm */

Template.quickForm.helpers({
  getTemplateName: function () {
    return AutoForm.getTemplateName('quickForm', this.template);
  },
  innerContext: function quickFormContext() {
    var atts = this;

    // get schema
    var schema = eval(this.collection).simpleSchema()._schema;

    // if atts.fields exists, restrict the schema to specified fields
    if (atts.fields) {
      // note: haven't found a clean way to do this all in one go yet, so doing it later. 
    }

    // get list of unique field groups with any falsy values removed
    // note: if atts.fields is specified, only consider fields contained in it
    var fieldGroups = _.compact(_.unique(_.map(schema, function (property, key) {
      return (!atts.fields || _.contains(atts.fields, key)) && property.autoform && property.autoform.group ;
    }))).sort();

    // build fieldGroups array
    var fieldGroups = _.map(fieldGroups, function (property, key) {

      var fieldGroupName = property;

      // for each fieldset, get list of field names
      var fieldsForGroup = _.compact(_.map(schema, function (property, key) {
        return property.autoform && property.autoform.group && property.autoform.group === fieldGroupName && key;
      }));

      return {
        name: fieldGroupName,
        fields: fieldsForGroup
      };
    });

    // get all fields with no field group specified
    // note: if atts.fields is specified, only consider fields contained in it
    var fieldWithNoGroups = _.compact(_.map(schema, function (property, key) {
      return (!atts.fields || _.contains(atts.fields, key)) && (!property.autoform || !property.autoform.group) && key;
    }));
    var fieldWithNoGroups = {fields: fieldWithNoGroups};

    // Pass along quickForm context to autoForm context, minus a few
    // properties that are specific to quickForms.
    var qfAutoFormContext = _.omit(atts, "buttonContent", "buttonClasses", "fields", "omitFields");

    // Determine whether we want to render a submit button
    var qfShouldRenderButton = (atts.buttonContent !== false && atts.type !== "readonly" && atts.type !== "disabled");

    var context = {
      qfAutoFormContext: qfAutoFormContext,
      atts: atts,
      qfShouldRenderButton: qfShouldRenderButton,
      fieldsWithNoGroups: fieldWithNoGroups,
      fieldGroups: fieldGroups
    };
    return context;
  }
});
