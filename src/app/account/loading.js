import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
    return (
        <div>
            <FontAwesomeIcon icon={faSpinner} spinPulse className="text-slate-500 w-12 h-12" />
        </div>
    );
};

export default Loading;