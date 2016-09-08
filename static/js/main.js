require.config({
    paths : {
        'zepto': "libs/zepto.min",
        'config': "config" 
    },
    shim: {
        'zepto': {
            exports: '$'
        }
    }
})
