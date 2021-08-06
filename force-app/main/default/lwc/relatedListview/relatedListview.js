import {LightningElement, wire,track, api} from 'lwc';
import getRecordsList from '@salesforce/apex/relatedListviewController.getRecordsList';
import { refreshApex } from '@salesforce/apex';
  
const columns = [
    { label: 'Name', fieldName: 'nameUrl', type: 'url', sortable: true, typeAttributes: {label: { fieldName: 'Name' }, 
    target: '_top'}},
    { label: 'Owner', fieldName: 'ownerName', type: 'String', sortable: true},
    { label: 'Created Date', fieldName: 'createdDate', type: 'date-local', typeAttributes:{day:"2-digit", month: "2-digit"}, sortable: true},
];

export default class ListviewOpp extends LightningElement {
    @api recordId;
    @track error;
    @track data = [];
    @track columns;
    @track tableLoadingState = true;
    @track sortBy;
    @track sortDirection;
    @track dataSize;
    isLoaded; 
    refreshQuery;

    @wire(getRecordsList , { aId: '$recordId'})
    wiredRecordsMethod(value) {
        this.refreshQuery = value;
        const { data, error } = value;
        if (data) {
            this.isLoaded = false;
            this.dataSize = data;
            this.data = data.map(record => Object.assign(
                { "nameUrl": '/'+record.Id,
                  "ownerName": record.Id ? record.Owner.Name : '',
                  "createdDate": record.Id ? record.CreatedDate : ''},
                record
            ));

            this.error = undefined;
            this.columns = columns;

            const size = {size: this.dataSize.length};
            const sizeInformationFunction = new CustomEvent('sizeInformation',{
                detail : {size},
            });
            this.dispatchEvent(sizeInformationFunction);
            
            setTimeout(() => {
                this.isLoaded = true;
            }, 400);

        } else if (error) {
            this.error = error;
            this.data  = undefined;
        }
        this.tableLoadingState  = false;
    }
        
    updateColumnSorting(event){
            //assign the values
            let sortByField = event.detail.fieldName;
            console.log('SORT');
            console.log(sortByField);
            if(sortByField === "nameUrl"){
                this.sortBy = "Name";
            }else{
                this.sortBy = sortByField
            }
            console.log(this.sortBy);
            this.sortDirection = event.detail.sortDirection;
            this.sortData(this.sortBy, event.detail.sortDirection);
            this.sortBy = sortByField;
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;

    }

    @api
    getFiredFromAura() {
        this.isLoaded = false;
        setTimeout(() => {
            this.isLoaded = true;
        }, 400);
        return refreshApex(this.refreshQuery);
    }
        
}