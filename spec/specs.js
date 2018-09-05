module.exports =add;
describe('Register a user', ()=>{
    it("should be able to register a user", ()=>{
        expect(Add(10,5)).toEqual(100);
    });
});

var add =(x,y)=>{
    return x+y;
}
