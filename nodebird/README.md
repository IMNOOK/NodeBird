추가해야할 기능
1.x.x
https://www.everdevel.com/JavaScript/innerText/
0) MVC 패턴화
라우터에서 함수들을 빼서 controller를 생성하고 -> 완료
controller에서 DB와 연결이 필요한 부분을 빼서 models 생성 -> 완료

model에서 (DAO[Data Access Object]와 같은 역할!)을 작성
이때 규칙 생성 ->

https://velog.io/@neity16/NodeJS-%EB%A1%9C%EC%A7%81-%EB%B6%84%EB%A6%ACroutesmodels-controllers

1) CACHING -> 완료!
DB와의 연결을 최소화 -> 속도 높임 
객체 선언 후 객체에 사용자 정보 저장, 객체 안에 캐싱된 값이 있으면 조회.
이후 DB에서 변경된 값을 가져와야 할 때만 DB에서 가져옴.


2) redirect 와 res.render 차이 -> 완료
redirect 조회는 변함 없이 단순이 이동만 시킴
render 조회 + 1 값들을 다 변경 시키면서 새롭게 페이지 뛰움
적절히 상황에 맞게 사용하자.


3) post delete 했을 때, uploads 사진도 삭제
쓸데 없는 용량 차지 삭제

4) post에 댓글 달기
기능 +

5) post 수정

6) next(error)을 어디서 할지

2.x.x
1) 사진이 아니라 만화 올리기 기능
