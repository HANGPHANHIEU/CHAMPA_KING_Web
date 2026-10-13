// Lấy các phần tử HTML cần dùng
const feed = document.getElementById('feed');           // Vùng chứa danh sách video
const uploadBtn = document.getElementById('uploadBtn'); // Nút hình tròn "+"
const input = document.getElementById('upload');        // Ô chọn file video (ẩn)

// Đếm số video đã lưu trong localStorage (nếu chưa có thì = 0)
let videoCount = parseInt(localStorage.getItem('champa_count') || '0');

// Khi bấm nút "+" thì mở hộp thoại chọn file
uploadBtn.onclick = () => input.click();

// Khi người dùng chọn xong file video
input.addEventListener('change', async () => {
  const file = input.files;                             // Lấy file vừa chọn
  if (!file) return;                                    // Nếu không có file thì dừng

  const loading = createLoading();                      // Hiện màn hình "Đang tải lên..."
  try {
    // Upload file lên Uploadcare
    const result = await window.uploadcare.fileFrom('object', file).upload();
    const videoUrl = "https://ucarecdn.com/" + result.uuid + "/";  // Lấy link video

    videoCount++;                                       // Tăng số lượng video lên 1
    localStorage.setItem('champa_count', videoCount);   // Lưu số lượng video
    localStorage.setItem('champa_video_' + videoCount, videoUrl);  // Lưu link video

    removeLoading(loading);                             // Xóa màn hình loading
    addVideo(videoUrl, videoCount);                     // Thêm video mới vào feed
  } catch (e) {
    removeLoading(loading);                             // Nếu lỗi thì cũng xóa loading
    alert("Upload lỗi rồi chồng iu ơi, thử lại nha ❤️"); // Hiện thông báo lỗi dễ thương
  }
});

// Tạo màn hình loading khi đang upload
function createLoading() {
  const div = document.createElement('div');            // Tạo thẻ div mới
  div.className = 'video';                           // Gán class giống video
  div.innerHTML = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:50px">Đang tải lên...</div>`;
                                                        // Nội dung loading
  feed.appendChild(div);                                // Thêm vào feed
  div.scrollIntoView();                                 // Cuộn tới màn hình loading
  return div;                                           // Trả về thẻ div để sau này xóa
}

// Xóa màn hình loading
function removeLoading(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el); // Nếu còn tồn tại thì xóa
}

// Thêm 1 video vào feed
function addVideo(url, num) {
  const div = document.createElement('div');            // Tạo thẻ div mới
  div.className = 'video';                           // Gán class video
  div.innerHTML = `
    <video src="${url}" autoplay loop muted playsinline></video>
                                                        // Thẻ video tự phát, lặp, tắt tiếng
    <div class="overlay">
      <h2 style="color:#D4AF37">CHAMPA KING</h2>       // Tên kênh màu vàng
      <p>Video #${num} – Champa đã trở lại!</p>         // Số thứ tự video
      <div>❤️ 3.8M • 💬 299K</div>                     // Số like + comment giả
    </div>
  `;
  feed.appendChild(div);                                // Thêm vào feed
  div.scrollIntoView({behavior: 'smooth'});             // Cuộn mượt tới video mới
}

// Khi mở app thì load lại toàn bộ video cũ đã lưu
for(let i = 1; i <= videoCount; i++) {
  const url = localStorage.getItem('champa_video_' + i); // Lấy link video thứ i
  if(url) addVideo(url, i);                             // Nếu có thì thêm vào feed
}