interface DataDebuggerProps {
    content: {[key: string]: {value: string; valueAr?: string; id: number}};
}

export default function DataDebugger({ content }: DataDebuggerProps) {
    const allKeys = Object.keys(content);
    const productKeys = allKeys.filter(key => key.startsWith('product-'));
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white font-bold mb-2">Data Debug Info</h3>
            <p className="text-gray-300 text-sm">Total keys: {allKeys.length}</p>
            <p className="text-gray-300 text-sm">Product keys: {productKeys.length}</p>
            
            <div className="mt-2">
                <h4 className="text-yellow-400 font-semibold text-sm">Heavy Duty Products:</h4>
                {['product-m1', 'product-m2', 'product-m4', 'product-m5', 'product-m6', 'product-m7', 'product-m8', 'product-m9'].map(product => {
                    const productNameKey = `${product}-product-name`;
                    const hasData = content[productNameKey];
                    return (
                        <div key={product} className={`text-xs ${hasData ? 'text-green-400' : 'text-red-400'}`}>
                            {product}: {hasData ? `✓ ${hasData.value}` : '✗ Missing'}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-2">
                <h4 className="text-blue-400 font-semibold text-sm">Light Duty Products:</h4>
                {['product-double-deck', 'product-9-leg'].map(product => {
                    const productNameKey = `${product}-product-name`;
                    const hasData = content[productNameKey];
                    return (
                        <div key={product} className={`text-xs ${hasData ? 'text-green-400' : 'text-red-400'}`}>
                            {product}: {hasData ? `✓ ${hasData.value}` : '✗ Missing'}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-2">
                <h4 className="text-purple-400 font-semibold text-sm">Rental Product:</h4>
                {['product-rental'].map(product => {
                    const productNameKey = `${product}-product-name`;
                    const hasData = content[productNameKey];
                    return (
                        <div key={product} className={`text-xs ${hasData ? 'text-green-400' : 'text-red-400'}`}>
                            {product}: {hasData ? `✓ ${hasData.value}` : '✗ Missing'}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}