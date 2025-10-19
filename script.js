(function(){
const boardEl=document.getElementById('board');
const cells=Array.from(boardEl.querySelectorAll('.cell'));
const statusEl=document.getElementById('status');
const newGameBtn=document.getElementById('newGameBtn');
const resetScoreBtn=document.getElementById('resetScoreBtn');
const swapBtn=document.getElementById('swapBtn');
const modeSelect=document.getElementById('modeSelect');
const scoreEls={X:document.getElementById('scoreX'),O:document.getElementById('scoreO'),D:document.getElementById('scoreD')};
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board=Array(9).fill(null),current='X',gameActive=true,mode=localStorage.getItem('ttt_mode')||'ai';
let scores=JSON.parse(localStorage.getItem('ttt_scores')||'{"X":0,"O":0,"D":0}');
let firstPlayer=localStorage.getItem('ttt_first')||'X';
modeSelect.value=mode;renderScores();refreshStatus();
cells.forEach(b=>b.addEventListener('click',onCellClick));
newGameBtn.addEventListener('click',startNewGame);
resetScoreBtn.addEventListener('click',resetScores);
swapBtn.addEventListener('click',swapFirst);
modeSelect.addEventListener('change',e=>{mode=e.target.value;localStorage.setItem('ttt_mode',mode);startNewGame()});
function onCellClick(e){const i=+e.currentTarget.dataset.index;if(!gameActive||board[i])return;place(i,current);const r=evaluate();if(r)return finish(r);toggle();if(mode==='ai'&&current==='O'&&gameActive)setTimeout(()=>{const i2=bestMove(board,'O');place(i2,'O');const r2=evaluate();if(r2)return finish(r2);toggle();},120)}
function place(i,m){board[i]=m;const b=cells[i];b.textContent=m;b.setAttribute('aria-label',`Cell ${i+1} ${m}`);b.setAttribute('aria-disabled','true')}
function evaluate(){for(const [a,b,c]of wins){if(board[a]&&board[a]===board[b]&&board[a]===board[c])return{type:'win',player:board[a],line:[a,b,c]}}if(board.every(Boolean))return{type:'draw'};return null}
function finish(r){gameActive=false;if(r.type==='win'){r.line.forEach(i=>cells[i].style.borderColor='var(--primary)');scores[r.player]++;statusEl.textContent=`${r.player} wins! Tap New Game to play again.`}else{scores.D++;statusEl.textContent=`It's a draw. Tap New Game to play again.`}persist();renderScores()}
function toggle(){current=current==='X'?'O':'X';refreshStatus()}
function refreshStatus(){statusEl.textContent=`Your turn: ${current}`}
function startNewGame(){board=Array(9).fill(null);gameActive=true;current=firstPlayer;cells.forEach((b,i)=>{b.textContent='';b.style.borderColor='#334155';b.removeAttribute('aria-disabled');b.setAttribute('aria-label',`Cell ${i+1} empty`)});refreshStatus();if(mode==='ai'&&current==='O')setTimeout(()=>{const i=bestMove(board,'O');place(i,'O');const r=evaluate();if(r)return finish(r);toggle()},120)}
function resetScores(){scores={X:0,O:0,D:0};persist();renderScores()}
function swapFirst(){firstPlayer=firstPlayer==='X'?'O':'X';localStorage.setItem('ttt_first',firstPlayer);startNewGame()}
function renderScores(){scoreEls.X.textContent=scores.X;scoreEls.O.textContent=scores.O;scoreEls.D.textContent=scores.D}
function persist(){localStorage.setItem('ttt_scores',JSON.stringify(scores))}
function bestMove(b,ai){const human=ai==='X'?'O':'X';let best=-Infinity,move=-1;for(let i=0;i<9;i++)if(!b[i]){b[i]=ai;const s=minimax(b,0,false,ai,human,-Infinity,Infinity);b[i]=null;if(s>best){best=s;move=i}}return move}
function minimax(b,d,isMax,ai,human,a,beta){const r=evalBoard(b);if(r!==null)return r-d*0.01;if(isMax){let best=-Infinity;for(let i=0;i<9;i++)if(!b[i]){b[i]=ai;best=Math.max(best,minimax(b,d+1,false,ai,human,a,beta));b[i]=null;a=Math.max(a,best);if(beta<=a)break;}return best}else{let best=Infinity;for(let i=0;i<9;i++)if(!b[i]){b[i]=human;best=Math.min(best,minimax(b,d+1,true,ai,human,a,beta));b[i]=null;beta=Math.min(beta,best);if(beta<=a)break;}return best}}
function evalBoard(b){for(const [a,b2,c]of wins){if(b[a]&&b[a]===b[b2]&&b[a]===b[c])return b[a]==='X'?1:-1}if(b.every(Boolean))return 0;return null}
startNewGame();
})();