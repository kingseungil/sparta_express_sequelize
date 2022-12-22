# 내일배움캠프
## node 숙련주차 개인과제
### sequelize.sync()를 사용하여 migrate하지않고 app.js실행하면 테이블됨생성됨
![image](https://user-images.githubusercontent.com/109774037/208811664-779b844f-a5cf-4774-844b-5893c70bf757.png)




1. 회원 가입 API
    - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
    - 비밀번호 확인은 비밀번호와 정확하게 일치하기
    - 닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기
    - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 response에 포함하기
2. 로그인 API
    - 닉네임, 비밀번호를 request에서 전달받기
    - 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤, 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 response에 포함하기
    - 로그인 성공 시 로그인 토큰을 클라이언트에게 Cookie로 전달하기
3. 로그인 검사
    - `아래 API를 제외하고` 모두 로그인 토큰을 전달한 경우만 정상 response를 전달받을 수 있도록 하기
        - 회원가입 API
        - 로그인 API
        - 게시글 목록 조회 API
        - 게시글 조회 API
        - 댓글 목록 조회 API
    - 로그인 토큰을 전달하지 않은 채로 로그인이 필요한 API를 호출한 경우 "로그인이 필요합니다." 라는 에러 메세지를 response에 포함하기
    - 로그인 토큰을 전달한 채로 로그인 API 또는 회원가입 API를 호출한 경우 "이미 로그인이 되어있습니다."라는 에러 메세지를 response에 포함하기
4. 댓글 목록 조회 API
    - 로그인 토큰을 전달하지 않아도 댓글 목록 조회가 가능하도록 하기
    - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 response에 포함하기
    - 제일 최근 작성된 댓글을 맨 위에 정렬하기
5. 댓글 작성 API
    - 로그인 토큰을 전달했을 때에만 댓글 작성이 가능하도록 하기
    - 로그인 토큰을 전달하지 않은 채로 댓글 작성란을 누르면 "로그인이 필요한 기능입니다." 라는 에러 메세지를 response에 포함하기
    - 댓글 내용란을 비워둔 채 API를 호출하면 "댓글 내용을 입력해주세요" 라는 에러 메세지를 response에 포함하기
6. 댓글 수정 API
    - 로그인 토큰에 해당하는 사용자가 작성한 댓글만 수정 가능하도록 하기
    - API를 호출한 경우 기존 댓글의 내용을 새로 입력한 댓글 내용으로 바꾸기
7. 댓글 삭제 API
    - 로그인 토큰에 해당하는 사용자가 작성한 댓글만 삭제 가능하도록 하기
8. 게시글 좋아요 API
    - 로그인 토큰을 전달했을 때에만 좋아요 할 수 있게 하기
    - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
    - 게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기
9. 좋아요 게시글 조회 API
    - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
    - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
    - 제일 좋아요가 많은 게시글을 맨 위에 정렬하기
