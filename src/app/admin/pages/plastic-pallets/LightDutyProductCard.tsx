interface LightDutyProductCardProps {
    productKey: string;
    productName: string;
    productNameAr: string;
    editingContent: { [key: string]: string };
    editingContentAr: { [key: string]: string };
    updateContent: (key: string, value: string) => void;
    updateContentAr: (key: string, value: string) => void;
    activeTab: 'en' | 'ar';
}

export default function LightDutyProductCard({
    productKey,
    productName,
    productNameAr,
    editingContent,
    editingContentAr,
    updateContent,
    updateContentAr,
    activeTab
}: LightDutyProductCardProps) {
    const isAr = activeTab === 'ar';
    const currentContent = isAr ? editingContentAr : editingContent;
    const updateCurrentContent = isAr ? updateContentAr : updateContent;

    return (
        <div className={`${isAr ? 'bg-amber-600/10 border-amber-600/20' : 'bg-green-600/10 border-green-600/20'} border rounded-lg p-3`}>
            <h5 className={`${isAr ? 'text-amber-200' : 'text-green-200'} font-medium mb-2`} dir={isAr ? 'rtl' : 'ltr'}>
                {isAr ? productNameAr : productName}
            </h5>
            <div className="space-y-2">
                <input
                    value={currentContent[`${productKey}-product-name`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-product-name`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'اسم المنتج' : 'Product Name'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                {!isAr && (
                    <div className="flex items-center gap-2">
                        <input
                            value={editingContent[`${productKey}-image`] || ''}
                            onChange={(e) => updateContent(`${productKey}-image`, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-cyan-300 text-xs placeholder-gray-600 focus:outline-none focus:border-green-500/50"
                            placeholder="Image URL (e.g. /images/pallets/double-deck.png)"
                        />
                        {editingContent[`${productKey}-image`] && (
                            <img
                                src={editingContent[`${productKey}-image`]}
                                alt="Preview"
                                className="w-10 h-10 object-contain rounded border border-white/10 bg-white/5 flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                    </div>
                )}
                <input
                    value={currentContent[`${productKey}-dimensions`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-dimensions`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الأبعاد' : 'Dimensions'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-design`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-design`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'التصميم' : 'Design'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-weight`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-weight`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الوزن' : 'Weight'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-static-load`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-static-load`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الحمولة الثابتة' : 'Static Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-dynamic-load`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-dynamic-load`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'الحمولة الديناميكية' : 'Dynamic Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-rack-load`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-rack-load`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'حمولة الرف' : 'Rack Load'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
                <input
                    value={currentContent[`${productKey}-expected-life`] || ''}
                    onChange={(e) => updateCurrentContent(`${productKey}-expected-life`, e.target.value)}
                    className={`w-full bg-white/5 border ${isAr ? 'border-amber-500/20 focus:border-amber-500/50' : 'border-white/10 focus:border-green-500/50'} rounded px-2 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none`}
                    placeholder={isAr ? 'العمر الافتراضي المتوقع' : 'Expected Life'}
                    dir={isAr ? 'rtl' : 'ltr'}
                />
            </div>
        </div>
    );
}