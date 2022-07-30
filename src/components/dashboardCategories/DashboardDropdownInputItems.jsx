import '../../scss/main.scss';

function DashboardDropdownInputItems({ item, isSelected, onItemSelected, onItemUnselected, displayDataFunction, displayDataFunctionPayload }) {

    let displayValue = item;

    if (displayDataFunction) {
        displayValue = displayDataFunction(item, displayDataFunctionPayload);
    }

    function toggleSelectedState() {
        if (isSelected) {
            onItemUnselected(item);
        }
        else {
            onItemSelected(item);
        }
    }
    return (
        <div className='dashboard-setting-dropdown-content-item' data-state={isSelected ? "selected" : "unselected"} onClick={toggleSelectedState}>
            <p>{displayValue}</p>
        </div>
    );
}

export default DashboardDropdownInputItems;