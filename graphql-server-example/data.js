export const authors = [{
    id:"1",
    name:'Albert',
    surname:'Camus',
    age:40,
    books : [{
      id:'vszvdv',
      title:'test title',
      score:7.4,
      isPublished:false
    }]
  }]
  
 export const books = [
    {
    id:'1',
    title:'Yabancı',
    author:authors[0],
    score:5.7,
    isPublished:true
  },
  {
    id:'2',
    title:'deneme kitap',
    author:authors[0],
    score:2.5,
    isPublished:false
  }
]
