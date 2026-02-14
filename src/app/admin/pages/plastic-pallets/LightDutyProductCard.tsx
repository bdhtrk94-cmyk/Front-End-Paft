interface LightDutyProductCardProps {
    productKey: string;
    productName: string;
    editingContent: {[key: string]: string};
    updateContent: (key: string, value: string) => void;
}

export default function LightDutyProductCard({ 
    productKey, 
    productName, 
    editingContent, 
    updateContent
}: LightDutyProductCardProps) {
    return (
        <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3">
            <h5 className="text-green-200 font-medium mb-2">{productName}</h5>
            <div className="space-y-2">
                <input 
                    value={editingContent[`${productKey}-product-name`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-product-name`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder={productName} 
                />
                <input 
                    value={editingContent[`${productKey}-dimensions`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-dimensions`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Dimensions" 
                />
                <input 
                    value={editingContent[`${productKey}-design`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-design`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Design" 
                />
                <input 
                    value={editingContent[`${productKey}-weight`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-weight`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Weight" 
                />
                <input 
                    value={editingContent[`${productKey}-static-load`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-static-load`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Static Load" 
                />
                <input 
                    value={editingContent[`${productKey}-dynamic-load`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-dynamic-load`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Dynamic Load" 
                />
                <input 
                    value={editingContent[`${productKey}-rack-load`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-rack-load`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Rack Load" 
                />
                <input 
                    value={editingContent[`${productKey}-expected-life`] || ''} 
                    onChange={(e) => updateContent(`${productKey}-expected-life`, e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                    placeholder="Expected Life" 
                />
            </div>
        </div>
    );
}