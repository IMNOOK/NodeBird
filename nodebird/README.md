추가해야할 기능
1.x.x

0) control에서 모듈 정리
라우터에서 함수들을 빼서 controller를 생성하고 -> 완료
controller에서 DB와 연결이 필요한 부분을 빼서 -> 
model에서 (DAO[Data Access Object]와 같은 역할!)을 작성

https://velog.io/@neity16/NodeJS-%EB%A1%9C%EC%A7%81-%EB%B6%84%EB%A6%ACroutesmodels-controllers

1) CACHING -> 완료!
DB와의 연결을 최소화 -> 속도 높임 
객체 선언 후 객체에 사용자 정보 저장, 객체 안에 캐싱된 값이 있으면 조회.

2) redirect 와 res.render 최적화
render을 최소화 -> 속도 높임

3) post delete 했을 때, uploads 사진도 삭제
쓸데 없는 용량 차지 삭제

4) post에 댓글 달기
기능 +

5) post 수정

2.x.x
1) 사진이 아니라 만화 올리기 기능
