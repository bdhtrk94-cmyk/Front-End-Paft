interface ProductSpecificationCardProps {
    productKey: string;
    productName: string;
    editingContent: {[key: string]: string};
    updateContent: (key: string, value: string) => void;
    showWeight?: boolean;
}

export default function ProductSpecificationCard({ 
    productKey, 
    productName, 
    editingContent, 
    updateContent, 
    showWeight = false 
}: ProductSpecificationCardProps) {
    // Create unique keys for this specific product
    const getUniqueKey = (field: string) => `${productKey}-${field}`;
    
    return (
        <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-3">
            <h5 className="text-orange-200 font-medium mb-2">{productName}</h5>
            <div className="space-y-2">
                <input 
                    value={editingContent[getUniqueKey('product-name')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('product-name'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Product Name" 
                />
                <input 
                    value={editingContent[getUniqueKey('dimensions')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('dimensions'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Dimensions" 
                />
                <input 
                    value={editingContent[getUniqueKey('design')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('design'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Design" 
                />
                {showWeight && (
                    <input 
                        value={editingContent[getUniqueKey('weight')] || ''} 
                        onChange={(e) => updateContent(getUniqueKey('weight'), e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                        placeholder="Weight" 
                    />
                )}
                <input 
                    value={editingContent[getUniqueKey('static-load')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('static-load'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Static Load" 
                />
                <input 
                    value={editingContent[getUniqueKey('dynamic-load')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('dynamic-load'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Dynamic Load" 
                />
                <input 
                    value={editingContent[getUniqueKey('rack-load')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('rack-load'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Rack Load" 
                />
                <input 
                    value={editingContent[getUniqueKey('expected-life')] || ''} 
                    onChange={(e) => updateContent(getUniqueKey('expected-life'), e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    placeholder="Expected Life" 
                />
            </div>
        </div>
    );
}