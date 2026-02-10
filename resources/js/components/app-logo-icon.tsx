import { FileText } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
        </div>
    );
}
