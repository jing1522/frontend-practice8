// 自习室数据：第二步先写死在数组里
const rooms = [
  { name: '一楼自习室 A', floor: 1, open: 'open' },
  { name: '一楼自习室 B', floor: 1, open: 'closed' },
  { name: '二楼自习室 C', floor: 2, open: 'open' },
  { name: '二楼自习室 D', floor: 2, open: 'open' },
  { name: '三楼自习室 E', floor: 3, open: 'closed' },
  { name: '三楼自习室 F', floor: 3, open: 'open' }
];

const floorFilter = document.getElementById('floor-filter');
const openFilter = document.getElementById('open-filter');
const roomList = document.getElementById('room-list');
const roomCount = document.getElementById('room-count');

const renderRooms = () => {
  // 1) 先按当前筛选条件算出要显示哪些
  const shown = rooms.filter(r => {
    const floorOk = floorFilter.value === '' || r.floor === Number(floorFilter.value);
    const openOk = openFilter.value === '' || r.open === openFilter.value;
    return floorOk && openOk;
  });

  // 2) 再重画列表：先清空，再逐条加
  roomList.innerHTML = '';
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = '没有符合条件的自习室';
    roomList.appendChild(li);
  }
  shown.forEach(r => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = r.name + ' · ' + r.floor + ' 层 · ' + (r.open === 'open' ? '开放中' : '已关闭');
    roomList.appendChild(li);
  });

  roomCount.textContent = '共 ' + shown.length + ' 间';
};

floorFilter.addEventListener('change', renderRooms);
openFilter.addEventListener('change', renderRooms);

renderRooms();

// ===== 统计区块：加载 data.json 渲染柱状图 =====
const chart = echarts.init(document.getElementById('usage-chart'));

$.getJSON('data/data.json')
  .done(data => {
    chart.setOption({
      title: {
        text: data.title,          // 标题
        subtext: data.source       // 数据来源
      },
      tooltip: { trigger: 'axis', valueFormatter: v => v + ' ' + data.unit },
      xAxis: { type: 'category', data: data.rooms.map(r => r.name) },
      yAxis: { type: 'value', name: '使用量（' + data.unit + '）' },   // 单位
      series: [{
        type: 'bar',
        data: data.rooms.map(r => r.count),
        barMaxWidth: 48
      }]
    });
  })
  .fail(() => {
    document.getElementById('chart-status').textContent = '加载失败：data/data.json 读取不到，请确认用本地服务器打开';
  });

window.addEventListener('resize', () => chart.resize());   // 窗口变窄时图表跟着缩