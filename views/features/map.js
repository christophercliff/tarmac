function(doc)
{
    if (doc.type === 'Feature' && doc.properties.type)
    {
        emit(doc.properties.type, doc);
    }
};