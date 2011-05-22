function(doc)
{
    if (doc.type === 'Feature')
    {
        if (doc.properties && doc.properties.type)
        {
            emit(doc.properties.type, null);
        }
    }
};