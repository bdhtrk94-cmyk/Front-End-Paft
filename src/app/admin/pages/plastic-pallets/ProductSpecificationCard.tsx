interface ProductSpecificationCardProps {
    productKey: string;
    productName: string;
    productNameAr: string;
    editingContent: { [key: string]: string };
    editingContentAr: { [key: string]: string };
    updateContent: (key: string, value: string) => void;
    updateContentAr: (key: string, value: string) => void;
    activeTab: 'en' | 'ar';
    showWeight?: boolean;
}

export default function ProductSpecificationCard({
    productKey,
    productName,
    productNameAr,
    editingContent,
    editingContentAr,
    updateContent,
    updateContentAr,
    activeTab,
    showWeight = false
}: ProductSpecificationCardProps) {
    // Create unique keys for this specific product
    const getUniqueKey = (field: string) => `${productKey}-${field}`;

    const isAr = activeTab === 'ar';
    const currentContent = isAr ? editingContentAr : editingContent;
    const updateCurrentContent = isAr ? updateContentAr : updateContent;

    return (
        <div className={`${isAr ? 'bg-amber-600/10 border-amber-600/20' : 'bg-orange-600/10 border-orange-600/20'} border rounded-lg p-3`}>
            <h5 className={`${isAr ? 'text-amber-200' : 'text-orange-200'} font-medium mb-2`} dir={isAr ? 'rtl' : 'ltr'}>
                {isAr ? productNameAr : productName}
            </h5>
            <div className="space-y-2">
                <input
                    value={currentContent[getUniqueKey('product-name')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('product-name'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'اسم المنتج' : 'Product Name'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                {!isAr && (
                    <div className="flex items-center gap-2">
                        <input
                            value={editingContent[getUniqueKey('image')] || ''}
                            onChange={(e) => updateContent(getUniqueKey('image'), e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-cyan-300 text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                            placeholder="Image URL (e.g. /images/pallets/m1.png)"
                        />
                        {editingContent[getUniqueKey('image')] && (
                            <img
                                src={editingContent[getUniqueKey('image')]}
                                alt="Preview"
                                className="w-10 h-10 object-contain rounded border border-white/10 bg-white/5 flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                    </div>
                )}
                <input
                    value={currentContent[getUniqueKey('dimensions')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('dimensions'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الأبعاد' : 'Dimensions'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[getUniqueKey('design')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('design'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'التصميم' : 'Design'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                {showWeight && (
                    <input
                        value={currentContent[getUniqueKey('weight')] || ''}
                        onChange={(e) => updateCurrentContent(getUniqueKey('weight'), e.target.value)}
                        className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                        placeholder={isAr ? 'الوزن' : 'Weight'}
                        dir={isAr ? 'rtl' : 'ltr'}
                    />
                )}
                <input
                    value={currentContent[getUniqueKey('static-load')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('static-load'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الحمولة الثابتة' : 'Static Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[getUniqueKey('dynamic-load')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('dynamic-load'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الحمولة الديناميكية' : 'Dynamic Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[getUniqueKey('rack-load')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('rack-load'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'حمولة الرف' : 'Rack Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[getUniqueKey('expected-life')] || ''}
                    onChange={(e) => updateCurrentContent(getUniqueKey('expected-life'), e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-orange-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'العمر الافتراضي المتوقع' : 'Expected Life'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
            </div>
        </div>
    );
}