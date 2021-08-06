({
    sizeCalculation : function(component, event, helper) {
        var eventData = event.getParam('size');
        component.set('v.recordCount', eventData.size);
        if(eventData.size == 0){
            component.set('v.showTable', false);
        }else{
            component.set('v.showTable', true);
        }
    },

    refreshParent: function(component, event, helper){
        var cmpTarget = component.find('changeIt');
        $A.util.toggleClass(cmpTarget, 'rotate');
        
        component.find('relatedListId').getFiredFromAura(); 
        
		setTimeout(removeClass, 400);
        function removeClass() {
            $A.util.toggleClass(cmpTarget, 'rotate')
        }
    }
})