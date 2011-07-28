function(doc)
{
    if (doc.type === 'database')
    {
        emit(doc.properties.type, doc);
    }
};