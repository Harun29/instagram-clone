import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Notifications = ({notifDropdown, setNotifDropdown}) => {

  return (  
    <div className="notifications">
      <button 
        className="close-notifications" 
        onClick={() => setNotifDropdown(!notifDropdown)}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      <p>Notifications</p>
    </div>
  );
}
 
export default Notifications;