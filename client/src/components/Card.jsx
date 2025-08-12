

import { BarChart3 } from 'lucide-react'; // or use any relevant icon
import { Link } from 'react-router';
const Card = ({title,description,button_text , image , path}) => {
  return (
    <div className="max-w-md rounded-lg bg-zinc-900 text-white p-6 shadow-md border border-zinc-800 gap-1">
      <div className="flex items-start gap-4">
        <div className="bg-zinc-800 p-3 rounded-full">
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-zinc-300">
            {description}
          </p>
          <Link to = {path}>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
             {button_text}
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;


 

 