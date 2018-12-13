/*:
 * Plugin Command:
 *  input_hp      # 
 * 	イベント体力設定。
 */
 
 	function Scene_Achievement() {
		this.initialize.apply(this, arguments);
	}
	
 (function() {

 	var audioResume = function(){
        if (WebAudio._context.state === "suspended") WebAudio._context.resume();
    };
    this.document.addEventListener("click", audioResume);
    this.document.addEventListener("touchend", audioResume);
    this.document.addEventListener("keydown", audioResume);
	   
 	//開発情報
	Scene_Title.prototype.version = function() {
		var version = new Sprite();
		this.addChild(version);
		version.bitmap = new Bitmap(300, 100);
		version.bitmap.drawText("Ver 1.0 Created by エリック", 0, 0, version.width, version.height, "left");
		version.x = 5;
		version.y = 555;
	}
	var STC = Scene_Title.prototype.create;
	Scene_Title.prototype.create = function() {
		STC.call(this);
		this.version();
	};
	
	Input.keyMapper[87] = 'up',
	Input.keyMapper[83] = 'down',
	Input.keyMapper[68] = 'right',
	Input.keyMapper[65] = 'left',
	
	Input.keyMapper[69] = 'ads';
    Input.keyMapper[32] = 'shoot';
	Input.keyMapper[71] = 'grenade';
	Input.keyMapper[81] = 'change';
	Input.keyMapper[82] = 'reload';
	
	var value = 2;
	var r_value = 3;
	var w_value = 4;
	var s_value = 5;
    var hp = 1;
    var range = 10;
	var magazine = 0;
	var magazine2 = 0;
	var bloodMap = [];
	var bomb_x = 0;
	var bomb_y = 0;
	
	//女子生存台詞
	var fs_aliveSpeak = [
	"助けて！",
	"お願い、止めて！",
	"殺さないで！",
	"いやあ！誰か！",
	"どうしてこんなことするの！？",
	"ああっ、神様！",
	"いやだっ！",
	"いやあっ！",
	"きゃあああっ！",
	"いやあああっ！",
	"来ないで！",
	"こっちに来ないで！"
	];
	var fs_aliveSpeakAddGun = [
	"撃たないで！"
	];
	
	//女子負傷台詞
	var fs_injSpeak = [
	"ううっ…痛いよう…",
	"ひぐっ…",
	"死にたくない…",
	"やだ…こんなの…",
	"どうして…どうして…",
	"痛いっ、痛いいっ…",
	"血が…止まらないようっ…",
	"はあっ…はあっ…",
	"うぐうっ…うーっ",
    "誰かっ…助けてぇ…",
	"お母さんっ…お母さんっ",
	"お父さん…助けて…",
	"わたし…なにもしてないのに…",
	"はぁ…はぁ…",
	"神様…助けて…"
	];
	
	//男子生存台詞
	var ms_aliveSpeak = [
    "助けてくれ！",
	"頼むから、止めてくれよ！",
	"誰か！",
	"やめろよっ！",
	"ふざけんなよおっ！！",
	"ざっけんなよお！",
	"なんでこんなことすんだよ！？",
	"なんでだよ畜生！",
	"いやだっ！",
	"くそっ！",
	"嘘だろおいっ！",
	"誰か警察呼べよっ！"
	];
	var ms_aliveSpeakAddGun = [
	"撃つな！",
	"撃たないでくれ！"
	];
	
	//抵抗男子生存台詞
	var ms_fightSpeak = [
    "ふざけやがって！",
	"ナメんなよ！",
	"お前なんか怖くないぞ！",
	"好い気になんなよ！",
	"調子に乗んじゃねえ！",
	"みんな今のうちに逃げろ！",
	"うおおおおっ！",
	"くそったれ！"
	];
	
	//男子負傷台詞
	var ms_injSpeak = [
	"うぐっ……いてえっ…",
	"死にたくないっ…",
    "嘘だろ…こんなのって…",
	"あああーっ…",
	"うぐう…ううっ…",
	"嫌だ…なんで…",
	"ざけんなよおっ…",
	"俺が…何かしたのかよおっ…",
	"なんで……だよっ…",
	"ううっ…"
	];
	
	//被弾台詞
	var hitSpeak = [];
	hitSpeak.push("ぎゃあっつ！");
	hitSpeak.push("うあっ！");
	hitSpeak.push("うぐっ！");
	hitSpeak.push("ああっ！");
	hitSpeak.push("うっ！");
	hitSpeak.push("あっ！");
	hitSpeak.push("ぐっ！");
	
　　　//教師台詞
    var teacherSpeak = [
	"止めろッ！",
	"もう止めるんだ！",
	"何やってんだお前！",
	"みんな今すぐ逃げろ！"
	];
    var teacherSpeakAddGun = [
	"銃を捨てろ！",
	"今すぐ銃を捨てろッ！",
	"銃を床に置けっ！",
	"銃を置くんだっ！！",
	"撃つのはもう止めろ！",
	"これ以上撃つんじゃない！"
	];
	var teacherSpeakAddKnife = [
	"刃物を捨てろ！",
	"今すぐ刃物を捨てろッ！",
	"刃物を床に置けっ！",
	"刃物を置くんだっ！！"
	];
	var w_teacherSpeak = [
	"不審者発見！ 不審者発見！",
	"増援願います！",
	"不審者を発見！",
	"不審者がいます！",
	"不審者発見しました！",
	"ここに不審者がいます！"
	];
	
	//犯人台詞
	var shooterSpeak = [
	"死ね！",
	"殺す！",
	"殺してやる！",
	"ぶっ殺す！",
	"ぶっ殺してやる！",
	"殺す　殺す　殺す！",
	"全員殺す！",
	"皆殺しにしてやる！",
	"くたばれ！",
	"こうでもしないと黙らないくせに！",
	"みんな敵　一人残らず！",
	"報いを受けろ！",
	"学校はもう終わり！",
	"どうせみんな死ぬんだ！",
	"みんな死ねばいいんだ！",
	"私の苦しみを知らなかったとは言わせない！",
	"弾がある限り撃ち続ける！",
	"弾はまだまだある！",
	"私が大人しく自殺するとでも！？",
	"私が自殺しなくて残念ね！",
	"銃は人を殺す、私も人を殺す！",
	"鬼ごっこの時間だ！",
	"逃げられるものなら逃げてみれば！",
	"私はもう 逃げも隠れもしない！",
	"何もかも終わらせる！",
	"これで終わりだ！",
	"みんな苦しめばいいんだ！",
	"私に関わるヤツはみんな苦しめる！",
	"こんなことをするようには見えなかった！？",
	"自業自得だ！",
	"こうなるって分からなかった！？",
	"この私を生んだ連中を恨めばいい！",
	"みんな家族を失えばいい！",
	];

	//東城台詞
	var yuumiSpeak = [
	"鬼ごっこだ！",
	"ワタシが鬼！",
	"捕まえた！",
	"まだまだー！",
	"もっともっと捕まえてやるー！",
	"刺す刺す刺す！",
	"殺す殺す殺す！",
	"死ね死ね死ね！",
	"みんな死んじゃえ！",
	"ほらほら早く逃げないと！",
	"もっと必死になって逃げたら！",
	"死んじゃえ！",
	"このナイフ良く切れる！"
	];
	
	//ヤンデレ負傷台詞
	var yandereSpeak = [
	"こんな……女なんかに……！",
	"先輩を……守らないと……！",
	"この薄汚い女を……殺さないと……！",
	"先輩……先輩……",
	"先輩……今のうちに逃げて……！",
	"殺す……殺してやるっ……！",
	"私が……私が守らないと……！",
	"先輩を……傷付けたりしたら……絶対に……！",
	"絶対に……私が守るんだ……！",
	"この……クズ女……！",
	"殺す……！"
	];
	
	//校内放送
	var announcement = [];
	announcement.push("これより集会の準備を始めます。生徒は先生の指示に従い、教室で待機してください。繰り返します―――これより集会の準備を始めます。生徒は先生の指示に従い、教室で待機してください。");
	announcement.push("集会を開始します。全校生徒は先生の指示に従い移動を開始してください。繰り返します―――集会を開始します。全校生徒は先生の指示に従い移動を開始してください。");
	announcement.push("緊急放送！　緊急放送！　校内に武器を持った不審者が侵入中！　校内に武器を持った不審者が侵入中！　全校生徒と先生は、命を守るため、直ちに校外へ避難してください！　これは訓練ではありません！");
	
	//タイトルウィンドウ編集。
	Window_TitleCommand.prototype.standardBackOpacity = function(code, textState) {
        return 100;
    };
	Window_TitleCommand.prototype.windowWidth = function() {
		return 500;
	};
	Window_TitleCommand.prototype.lineHeight = function() {
		return 50;
	};
	Window_TitleCommand.prototype.standardFontSize = function() {
		return 40;
	};
	Window_TitleCommand.prototype.maxCols = function() {
		return 3;
	};
	Window_TitleCommand.prototype.updatePlacement = function() {
		this.x = (Graphics.boxWidth - this.width - 14);
		this.y = Graphics.boxHeight - this.height - 44;
	};
	
	//ウィンドウ透明度を変更。
	Window_Base.prototype.standardBackOpacity = function(code, textState) {
		return 255;
	};

	//スクリプトコマンドにより体力を設定する。
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
	    if (command === 'input_hp') {
			//体力保存変数にデータがないとき、オブジェクトを作る。
			if (!$gameVariables._data[hp]) $gameVariables._data[hp] = {};
			if (!$gameVariables._data[hp][this._mapId]) $gameVariables._data[hp][this._mapId] = {};
			if (!$gameVariables._data[hp][this._mapId][this._eventId]) $gameVariables._data[hp][this._mapId][this._eventId] = {};
			//体力保存変数に体力を保存。
			if($gameMap._events[this._eventId]._characterName == "yandere"){
				$gameVariables._data[hp][this._mapId][this._eventId] = 200;
			}else{
				$gameVariables._data[hp][this._mapId][this._eventId] = 100;
			}
		}
	};
	
	//リージョン１と４を障害物とし、それ以外を通行可能にする。
	Game_Map.prototype.isPassable = function(x, y, d) {
		if (this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f) || !this.regionId(x, y) == 1 || this.regionId(x, y) == 2 || this.regionId(x, y) == 3　|| !this.regionId(x, y) == 4) {
			return true;
		}else if(this.regionId(x, y) == 4){
			return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
		}
	};
	
	//被害者のタイプに基づいてポイントを獲得
	gainGold = function(event, isDead) {
		switch (event) {
			case "teacher": $gameVariables._data[17] += 100; if(isDead)$gameVariables._data[31]++; break;
			case "w_teacher": $gameVariables._data[17] += 200; if(isDead)$gameVariables._data[30]++; break;
			case "male_students": $gameVariables._data[17] += 300; if(isDead)$gameVariables._data[29]++; break;
			case "female_students ": $gameVariables._data[17] += 400; if(isDead)$gameVariables._data[28]++; break;
			case "yandere": $gameVariables._data[17] += 5000; $gameSwitches.setValue(35,true); break;
		}
	}
	
	//命中判定ループ処理。
	function hitDecision(x, y, weapon){

		var knife = $gameParty.leader()._equips[0]._itemId == 16;
		var _x = $gamePlayer.x += x;
	    var _y = $gamePlayer.y += y;
		
		range = knife ? 1 : 10;
		
		//ループ処理。
		label:
		for (var i = range; i >= 1; i--){
			
			//イベントが存在する時、体力が存在するイベントを取る。
			for (var _i = 0; $gameMap.eventsXy(_x, _y).length > _i; _i++){
				if ($gameVariables._data[hp][$gameMap._mapId][$gameMap.eventsXy(_x, _y)[_i]._eventId]){
					var eventName = $gameMap.eventsXy(_x, _y)[_i]._characterName;
					var eventHp = $gameVariables._data[hp][$gameMap._mapId][$gameMap.eventsXy(_x, _y)[_i]._eventId];
					var eventId = $gameMap.eventsXy(_x, _y)[_i]._eventId;
					//キャラクターなら体力を減らす。
			        if (eventHp >= 1){
						var key_b = [$gameMap._mapId, eventId, "B"];
						var key_c = [$gameMap._mapId, eventId, "C"];
						var rand = Math.floor(Math.random() * 101);
						var temp = $gameActors.actor(1).hasSkill(14) ? 10 : 5;
						//クリティカルなら無条件で殺害。ヤンデレには無効。
						if (rand <= temp && eventName != "yandere") {
							$gameVariables._data[27]++;
							gainGold(eventName, 1);
							$gameMap._events[eventId].requestAnimation(8);
				            $gameVariables._data[hp][$gameMap._mapId][eventId] = 0;
							$gameVariables._data[2] += 1;
							if (eventHp < 100) $gameVariables._data[3] -= 1;
					        $gameMap._events[eventId].forceMoveRoute({"list":[{"code":16},{"code":0}], "repeat":false, "wait":false});
					        $gameSelfSwitches.setValue(key_c, true);

							if (Math.floor(Math.random() * 2) == 0) { 
								Scene_Map.prototype.createSpeakWindow();
								var temp = SceneManager._scene.newWindowId;
								SceneManager._scene._speakWindow[temp].event($gamePlayer, Speak(5, 0));
							}

							break label;
						}
						//ペインキラーがあり、負傷かつゼロ距離なら、50％の確立で殺害。
						if (i == 10 && eventHp < 100 && $gameActors.actor(1).hasSkill(12) && Math.floor(Math.random() * 2) == 0) {
							$gameVariables._data[27]++;
							gainGold(eventName, 1);
							$gameMap._events[eventId].requestAnimation(8);
				            $gameVariables._data[hp][$gameMap._mapId][eventId] = 0;
							$gameVariables._data[2] += 1; $gameVariables._data[3] -= 1;
					        $gameMap._events[eventId].forceMoveRoute({"list":[{"code":16},{"code":0}], "repeat":false, "wait":false});
					        $gameSelfSwitches.setValue(key_c, true);
							break label;
						}
						//当たったか外したか？
						var temp = Number(weapon.meta.isShotgun) ? 25 : 0;
						var recoil = Math.round( (($gameVariables._data[4] + $gameVariables._data[8]) / 2) + temp);
						if (!knife) recoil = Math.round(recoil -= $gameVariables._data[35]);
						rand = Math.floor(Math.random() * 101);
						if (recoil < rand){
							break label;
						}
						
						$gameVariables._data[27]++;
						
						//被弾エフェクト・出血スプライトの生成。
						$gameMap._events[eventId].requestAnimation(2);
						var bx = Math.floor($gameMap._events[eventId]._realX);
						var by = Math.floor($gameMap._events[eventId]._realY);
						if (!Scene_Map.prototype.isBlood(bx, by)) Scene_Map.prototype.createBlood(bx, by);
						
				        //体力100から減算なら負傷者を加算。
						if (eventName == "yandere") {
							if (eventHp == 200) {
								$gameVariables._data[3] += 1;
							}else if(eventHp < 100) {
								$gameSelfSwitches.setValue(key_b, true);
							}
						}else{
							if (eventHp == 100) {
								$gameVariables._data[3] += 1;
								$gameSelfSwitches.setValue(key_b, true);
								if (Math.floor(Math.random() * 2) == 0) { 
									if ($gameMap._events[eventId]._window) {
										SceneManager._scene.removeChild(SceneManager._scene._speakWindow[$gameMap._events[eventId]._windowId]);
									}
									Scene_Map.prototype.createSpeakWindow();
									var temp = SceneManager._scene.newWindowId;
									SceneManager._scene._speakWindow[temp].event($gameMap._events[eventId], Speak(2, 0));
								}
							}
						}
						//ダメージ計算。
						if (knife){
							var max = 100; var min = 20;
						}else{
							var temp = Number(weapon.meta.isShotgun) ? 25 - ( (range - i)*10 ) : 0;
							var max = weapon.params[2] + 10 + temp;
							var min = weapon.params[2] - 10 + temp;
						}
						rand = Math.floor( Math.random() * (max + 1 - min) ) + min ;
						if ($gameActors.actor(1).hasSkill(13) && (eventName == "teacher" || eventName == "w_teacher")) rand = Math.round(rand * 1.5);
				        $gameVariables._data[hp][$gameMap._mapId][eventId] -= rand;
				        eventHp -= rand;
				        //死亡ならスイッチをtrue、死者を加算し負傷者を減算。加害者セリフの判定。
				        if (eventHp <= 0 && !$gameSelfSwitches.value(key_c)){
							gainGold(eventName, 1);
					        $gameVariables._data[2] += 1; $gameVariables._data[3] -= 1;
					        $gameMap._events[eventId].forceMoveRoute({"list":[{"code":16},{"code":0}], "repeat":false, "wait":false});
					        $gameSelfSwitches.setValue(key_c, true);

							if (Math.floor(Math.random() * 2) == 0　|| eventName == "yandere") { 
								Scene_Map.prototype.createSpeakWindow();
								var temp = SceneManager._scene.newWindowId;
								SceneManager._scene._speakWindow[temp].event($gamePlayer, Speak(5, 0));
							}


				        }
				        break label;
			        }
				}
			}
			
			//地形タグが１、障害物なら処理を中断する。
		    if ($gameMap.regionId(_x, _y) == 1)　break;
			
			_x += x;
			_y += y;
			
        }
	};

	//射撃練習用。
	function TrainingHitDecision(x, y, weapon){
			
		var _x = $gamePlayer.x += x;
	    var _y = $gamePlayer.y += y;
		   
		label:
		for (var i = range; i >= 1; i--){
			
			for (var _i = 0; $gameMap.eventsXy(_x, _y).length > _i; _i++){
				if ($gameVariables._data[hp][$gameMap._mapId][$gameMap.eventsXy(_x, _y)[_i]._eventId]){
					var eventName = $gameMap.eventsXy(_x, _y)[_i]._characterName;
					var eventHp = $gameVariables._data[hp][$gameMap._mapId][$gameMap.eventsXy(_x, _y)[_i]._eventId];
					var eventId = $gameMap.eventsXy(_x, _y)[_i]._eventId;
			        if (eventHp >= 1){
						var key_a = [$gameMap._mapId, eventId, "A"];
						var recoil = Math.round(($gameVariables._data[4] + $gameVariables._data[8]) / 2);
						recoil = Math.round(recoil -= $gameVariables._data[35]);
						var rand = Math.floor(Math.random() * 101);
						if (recoil < rand){
							break label;
						}
						$gameSelfSwitches.setValue(key_a, true);
						$gameVariables._data[2] += 1;
				        $gameVariables._data[hp][$gameMap._mapId][eventId] = 0;
				        break label;
			        }
				}
			}
			
		    if ($gameMap.regionId(_x, _y) == 1) {
				break;
			}
			
			_x += x;
			_y += y;
			
        }
	};
	
	//射撃反動を入力。
	recoil = function(value) {
		if ($gameVariables._data[8] > value){
			$gameVariables._data[8] -= value
		}else{
			$gameVariables._data[8] = 0;
		}
	}
	
	Scene_Map.prototype.shooting = function() {
		
		$gameVariables._data[26]++;
		
	    var actor = $gameParty.leader(); 
	    var weapon =　$dataWeapons[actor._equips[0]._itemId];
		var knife = actor._equips[0]._itemId == 16;
		
		if (knife) {　
			$gameSwitches.setValue(28,true);
		}else if ($gameMap._mapId == 2) {
			AudioManager.playSe({"name":"Echo","volume":150,"pitch":100,"pan":0});
		}

	    //命中判定。
		switch ($gamePlayer._direction) {
            case 2:
		        if(!$gameSwitches.value(25) && !knife) $gamePlayer.requestAnimation(3);
				$gameSwitches.value(25) ? TrainingHitDecision(0, 1, weapon) : hitDecision(0, 1, weapon)
				break;
            case 4:
				if(!$gameSwitches.value(25) && !knife){
					if (!$gameSwitches.value(20) && $dataWeapons[$gameParty.leader()._equips[0]._itemId].wtypeId == 2){
						$gamePlayer.requestAnimation(13);
					}else{
						$gamePlayer.requestAnimation(4);
					}
				}
                $gameSwitches.value(25) ? TrainingHitDecision(-1, 0, weapon) : hitDecision(-1, 0, weapon)
                break;
            case 6:
				if(!$gameSwitches.value(25) && !knife){
					if (!$gameSwitches.value(20) && $dataWeapons[$gameParty.leader()._equips[0]._itemId].wtypeId == 2){
						$gamePlayer.requestAnimation(14);
					}else{
						$gamePlayer.requestAnimation(5);
					}
				}
                $gameSwitches.value(25) ? TrainingHitDecision(1, 0, weapon) : hitDecision(1, 0, weapon)
                break;
            case 8:
				if(!$gameSwitches.value(25) && !knife) $gamePlayer.requestAnimation(6);
                $gameSwitches.value(25) ? TrainingHitDecision(0, -1, weapon) : hitDecision(0, -1, weapon)
                break;
        }
		
		//発砲音の再生、銃の性能による命中率の低下。
		switch (weapon.id) {
            case 1: //G17
			    recoil(7 * movingType());
			    AudioManager.playSe({"name":"gunshot02","volume":150,"pitch":120,"pan":0});
				break;
			case 2:　//C1911
			    recoil(10 * movingType());
			    AudioManager.playSe({"name":"gunshot02","volume":150,"pitch":80,"pan":0});
				break;
		    case 3:　//TEC9
			    recoil(7 * movingType());
			    AudioManager.playSe({"name":"gunshot01","volume":100,"pitch":100,"pan":0});
				break;
		    case 4:　//AR14
			    recoil(14 * movingType());
			    AudioManager.playSe({"name":"gunshot09","volume":150,"pitch":100,"pan":0});
				break;
			case 5:　//Type56
			    recoil(18 * movingType());
			    AudioManager.playSe({"name":"gunshot07","volume":120,"pitch":100,"pan":0});
				break;
		    case 6:　//SR22
			    recoil(3 * movingType());
			    AudioManager.playSe({"name":"gunshot06","volume":120,"pitch":120,"pan":0});
				break;
		    case 7:　//S870
			    recoil(20 * movingType());
			    AudioManager.playSe({"name":"shotgun_pump","volume":150,"pitch":100,"pan":0});
				break;
	        case 8:　//S12
			    recoil(20 * movingType());
			    AudioManager.playSe({"name":"shotgun_semi","volume":150,"pitch":100,"pan":0});
				break;
	        case 9:　//BM15 Mod
			    recoil(10 * movingType());
			    AudioManager.playSe({"name":"gunshot09","volume":150,"pitch":100,"pan":0});
				break;
	        case 10:　//BS3
			    recoil(20 * movingType());
			    AudioManager.playSe({"name":"shotgun_semi","volume":150,"pitch":100,"pan":0});
				break;
			case 11:　//BM15
			    recoil(14 * movingType());
			    AudioManager.playSe({"name":"gunshot09","volume":150,"pitch":100,"pan":0});
				break;
			case 12:　//C900
			    recoil(5 * movingType());
			    AudioManager.playSe({"name":"gunshot02","volume":150,"pitch":120,"pan":0});
				break;
			case 13:　//Toy9
			    recoil(1 * movingType());
			    AudioManager.playSe({"name":"Crossbow","volume":150,"pitch":150,"pan":0});
				break;
			case 14:　//Toy26
			    recoil(1 * movingType());
			    AudioManager.playSe({"name":"Crossbow","volume":150,"pitch":150,"pan":0});
				break;
		    case 15:　//VSG
			    recoil(20 * movingType());
			    AudioManager.playSe({"name":"shotgun_semi","volume":150,"pitch":100,"pan":0});
				break;
			case 16:　//ナイフ
				if ($gameVariables._data[4] > 1) $gameVariables._data[4] -= 20;
			    AudioManager.playSe({"name":"Sword5","volume":100,"pitch":150,"pan":0});
				break;
		}
		
	};
	// 歩行音
	var GPI = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
		GPI.call(this);
		this._walkSE = 0;
	};
	Game_Player.prototype.moveStraight = function(d) {
		if (this.canPass(this.x, this.y, d)) {
			this._followers.updateMove();
			$gameSwitches.setValue(15,true);
		}
		Game_Character.prototype.moveStraight.call(this, d);
	};
	// 完全装填？
	Scene_Map.prototype.isMax = function() {
		return $dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.rnd == magazine;
	}
	//マガジンの残弾を、武器の装弾数にする。
	Scene_Map.prototype.reloading = function() {
	    magazine = $dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.rnd;
	};
	//サブマガジンの残弾を、武器の装弾数にする（スタート時のみ使用）
	Scene_Map.prototype.reloading2 = function() {
	    magazine2 = $dataWeapons[$gameParty.leader()._equips[1]._itemId].meta.rnd;
	};
	//ショットガン用に一発だけ装填。
	Scene_Map.prototype.shotgun_reload = function() {
		if ($dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.rnd > magazine)　magazine += 1;
	};
	//メイン武器とサブ武器の入れ替え。
	Scene_Map.prototype.weaponChange = function() {
		var temp = $gameParty.leader()._equips[0];
        $gameParty.leader()._equips[0] = $gameParty.leader()._equips[1];
		$gameParty.leader()._equips[1] = temp;
		temp = magazine2;
		magazine2 = magazine;
		magazine = temp;
		this.playerPicChange();
	}
	//照準切り替え。
	Scene_Map.prototype.ads = function() {
		var ads = !$gameSwitches.value(20);
		$gameVariables._data[35] = $gameActors.actor(1).hasSkill(18) ? 100 : 50;
		$gameSwitches.setValue(20,ads);
		if (ads) {
			//ads開始。
			$gameSwitches.setValue(32,true);
			AudioManager.playSe({"name":"kacha","volume":100,"pitch":200,"pan":0});
			$gamePlayer._moveSpeed = 3;
			this.playerPicChange();
		}else{
			//ads終了。
			$gameSwitches.setValue(32,false);
			$gamePlayer._moveSpeed = 4;
			this.playerPicChange();
		}
	}
	//キャラクターグラフィック変更。
	Scene_Map.prototype.playerPicChange = function() {
		var wtype = $dataWeapons[$gameParty.leader()._equips[0]._itemId].wtypeId == 1 ? 2 : 1;
		var ads = $gameSwitches.value(20) ? 5 : 0
		if($gameParty.leader()._equips[0]._itemId == 16){
			$gameActors._data[1].setCharacterImage("yuumi", 0);
		}else{
			$gameActors._data[1].setCharacterImage("shooter", ads + wtype);
		}
		$gamePlayer.refresh()
	}
	//キーが押された時の動作総合。
	var _Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        _Scene_Map_updateScene.call(this);
		var knife = $gameParty.leader()._equips[0]._itemId == 16;
		//シーン切り替え中でない、かつ襲撃中である。
        if (!SceneManager.isSceneChanging() && $gameSwitches.value(value) || $gameSwitches.value(25)) {
			//スペースキーが押されている、かつウェイト・リロード・武器入れ替え・ダッシュ中ではない場合。
	        if (Input.isTriggered('shoot') && !$gameSwitches.value(r_value) && !$gameSwitches.value(w_value) && $dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.isAuto == 0　&& !$gameSwitches.value(10)　&& !$gamePlayer.isDashing()){
			    //残弾がなければ空撃ち音。
		        if (magazine <= 0) {
			        if (Input.isTriggered('shoot')){
			            AudioManager.playSe({"name":"empty","volume":100,"pitch":100,"pan":0});
					}
		        }else{
				//セミオート射撃。
					magazine -= 1;
					Scene_Map.prototype.shooting();
					$gameSwitches.setValue(w_value,true);
				}
		    }else if (Input.isPressed('shoot') && !$gameSwitches.value(r_value) && !$gameSwitches.value(w_value) && $dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.isAuto == 1 && !$gameSwitches.value(10) && !$gamePlayer.isDashing()){
		        if (magazine <= 0) {
					if (Input.isTriggered('shoot')){
			            AudioManager.playSe({"name":"empty","volume":100,"pitch":100,"pan":0});
					    $gameSwitches.setValue(w_value,true);
					}
		        }else{
					magazine -= 1;
			        Scene_Map.prototype.shooting();
					$gameSwitches.setValue(w_value,true);
				}
			}
			//Ｒキーが押されている、かつリロード中、入れ替え中、走行中ではない。
			if(Input.isTriggered('reload') && !$gameSwitches.value(r_value) && !$gameSwitches.value(10)　&& !$gamePlayer.isDashing() && !knife){
				$gameSwitches.setValue(r_value,true);
			}
			//Qキーが押されている、かつリロード中ではない。
			if(Input.isTriggered('change') && !$gameSwitches.value(r_value) && !knife){
				$gameSwitches.setValue(10,true);
			}
			//Gキーが押されている、かつリロード中、入れ替え中でない。
			if(Input.isPressed('grenade') && $gameVariables._data[41] > 0 && !$gameSwitches.value(r_value) && !$gameSwitches.value(12) && !$gameSwitches.value(13) && !$gameSwitches.value(10) && !$gameSwitches.value(25) && !knife){
				$gameVariables._data[41] -= 1;
				this.createBomb($gamePlayer.x, $gamePlayer.y);
				SceneManager._scene._bomb.visible = false;
				$gameSwitches.setValue(12,true);
			}
			//Eキーが押されている、かつリロード中ではない。
			if(Input.isTriggered('ads') && !$gameSwitches.value(r_value) && !knife){
				Scene_Map.prototype.ads();
			}
	    }
	};
	
	//爆弾の爆発
	Scene_Map.prototype.Bomb_explosion = function() {
		var x = SceneManager._scene._bomb.gx - 3;
		var y = SceneManager._scene._bomb.gy - 3;
		var max_x = SceneManager._scene._bomb.gx + 4;
		var max_y = SceneManager._scene._bomb.gy + 4;
		var killed = false;
		while (y < max_y){
			//プレイヤーがダメージ範囲。
			if ($gamePlayer._x == x && $gamePlayer._y == y){
				$gamePlayer.requestAnimation(11);
				$gameVariables._data[43] = 2;
				$gameVariables._data[4] = 0;
				$gameSwitches.setValue(34,true);
				$gameSwitches.setValue(24,true);
			}
			$gameMap.eventsXy(x, y).forEach(function(event) {
				if ($gameVariables._data[hp][$gameMap._mapId][event._eventId] > 0){
					var bx = Math.floor(event._realX);
					var by = Math.floor(event._realY);
					if (!Scene_Map.prototype.isBlood(bx, by)) Scene_Map.prototype.createBlood(bx, by);
					var key_b = [$gameMap._mapId, event._eventId, "B"];
					var key_c = [$gameMap._mapId, event._eventId, "C"];

						$gameVariables._data[hp][$gameMap._mapId][event._eventId] = 0;
						$gameMap._events[event._eventId].requestAnimation(11);
						

							if ($gameSelfSwitches.value(key_b)){
								$gameVariables._data[3] -= 1;
								gainGold(event._characterName, 0);
							}
							$gameVariables._data[2] += 1
							$gameSelfSwitches.setValue(key_c, true);
						
				}
			});
			x += 1;
			if (x == max_x){
				x -= 7; y += 1;
			}
			
		}
		SceneManager._scene._bomb.startAnimation($dataAnimations[10], false, 0);
		if (killed && Math.floor(Math.random() * 2) == 0) { 
			Scene_Map.prototype.createSpeakWindow();
			var temp = SceneManager._scene.newWindowId;
		    SceneManager._scene._speakWindow[temp].event($gamePlayer, Speak(5, 0));
		}
	};
	
	//画面の作成。
	var _SMCDO = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		_SMCDO.call(this);
		this._mapPlayerGaugeWindow = new Window_PlayerGauge();
	    this.addChild(this._mapPlayerGaugeWindow);
		this._mapStatusWindow = new Window_MapStatus();
	    this.addChild(this._mapStatusWindow);
		this._announcement = new Window_Announcement();
	    this.addChild(this._announcement);
		this._speakWindow = [];
	};
	
	//画面の更新。
	Scene_Map.prototype.update = function() {
        this.updateDestination();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount();
        Scene_Base.prototype.update.call(this);
		
		if ($gameSwitches.value(s_value)) {
			if (!this._mapStatusWindow.sprite.visible) {
			    this._mapStatusWindow.sprite.visible = true;
			    this._mapStatusWindow.contentsOpacity = 255;
			}
			if (this._mapPlayerGaugeWindow.contentsOpacity == 0) {
			    this._mapPlayerGaugeWindow.contentsOpacity = 255;
			}
			this._mapPlayerGaugeWindow.refresh();
			this._mapStatusWindow.refresh();
		}else{
			if (this._mapStatusWindow.sprite.visible) {
			    this._mapStatusWindow.sprite.visible = false;
			    this._mapStatusWindow.contentsOpacity = 0;
			}
			if (this._mapPlayerGaugeWindow.contentsOpacity == 255) {
			    this._mapPlayerGaugeWindow.contentsOpacity = 0;
			}
		}

		for (var i = 0; i < 10; i++){
			if (this._speakWindow[i]) {
				this._speakWindow[i].refresh();
			}
		}
		
    };
	
	//マップステータス画面の作成。
	function Window_MapStatus() {
        this.initialize.apply(this, arguments);
    };
	
    Window_MapStatus.prototype = Object.create(Window_Base.prototype);
    Window_MapStatus.prototype.constructor = Window_MapStatus;
	
	Window_MapStatus.prototype.initialize = function() {
		
		//ステータス画像表示。

		this.sprite = new Sprite();
		this.sprite.bitmap = ImageManager.loadPicture('Status');
		SceneManager._scene.addChild(this.sprite);
		this.sprite.visible = false;
        var wight = 816; var height = 624;
        Window_Base.prototype.initialize.call(this, 0, 0, wight, height);
        this.opacity = 0; this.contentsOpacity = 0;
        this.refresh();
    };
	
	Window_MapStatus.prototype.refresh = function() {
        this.contents.clear();
		var id = $gameParty.leader()._equips[0]._itemId;
		var knife = id == 16;
		if (id > 8) {
			var gun = "guns2"; 
			var faceId = id - 9;
		}else{
			var gun = "guns1";
			var faceId = id - 1;
		}
        var width = this.contentsWidth();
		//パイプ爆弾所持数表示。
		if (!knife && !$gameSwitches.value(25)){
			this.drawIcon(126, 680, 410);
			this.drawText(" × " + $gameVariables._data[41], -10, 410, width, 'right');
		}
		//銃画像表示。
		this.drawFace(gun, faceId, 635, 445, 144, 144);
		//残弾表示。
		if (!knife) this.drawText(magazine + "/" + $dataWeapons[id].meta["rnd"], -5, 550, width, 'right');
		//死傷者数表示。
		if (!$gameSwitches.value(25)){
			this.drawText($gameVariables._data[2], -165, 25, width, 'right');
			this.drawText($gameVariables._data[3], -18, 25, width, 'right');
		}else{
			this.sprite.visible = false;
		}
    };
	
    //スタミナ・命中率表示。
	function Window_PlayerGauge() {
        this.initialize.apply(this, arguments);
    };
    Window_PlayerGauge.prototype = Object.create(Window_Base.prototype);
    Window_PlayerGauge.prototype.constructor = Window_PlayerGauge;
	Window_PlayerGauge.prototype.initialize = function() {
        var wight = 100;
        var height = 100;
		$gameVariables._data[4] = 100;
		$gameVariables._data[8] = 100;
        Window_Base.prototype.initialize.call(this, 0, 0, wight, height);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this.refresh();
    };
	Window_PlayerGauge.prototype.refresh = function() {
        this.contents.clear();
		var knife = $gameParty.leader()._equips[0]._itemId == 16;
		var isMax = $dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.rnd == magazine;
		var recoil = Math.round(($gameVariables._data[4] + $gameVariables._data[8]) / 2);
		if (!knife) recoil = Math.round(recoil -= $gameVariables._data[35]);
		if (Number($dataWeapons[$gameParty.leader()._equips[0]._itemId].meta.isShotgun)) recoil += 25;
		if (recoil < 0) recoil = 0;
		
        var width = this.contentsWidth();
	    var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
		this.x = $gamePlayer.screenX() - 50; 
		this.y = $gamePlayer.screenY() - 100;
		this.makeFontSmaller();
		if ($gameSwitches.value(3) && !isMax){
			this.drawText("Reload", 0, 0, width, 'center');
		}else{
			this.drawText(recoil + "％", 0, 0, width, 'center');
		}
		if ($gameVariables._data[4] < 100) this.drawGauge(0, 0, width, $gameVariables._data[4] / 100, color1, color2);
    };
	//スタミナ切れの判定。
	Game_Player.prototype.updateDashing = function() {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled() && !$gameSwitches.value(6)) {
            this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        } else {
            this._dashing = false;
        }
    };
	//移動速度を判定。
	function movingType() {
        var move = 0;
        if ($gamePlayer.realMoveSpeed() <= 5) {
            if ($gameActors.actor(1).hasSkill(10)) {
				move = 2;
			}else{
				move = 3;
			}
        }else if ($gamePlayer.isMoving()) {
            move = 2;
        }else{
            move = 1;
        }
		return move;
    };
	//キャラクターに発言ウィンドウ関連の変数を設定。
	var GCB = Game_CharacterBase.prototype.initMembers;
	Game_CharacterBase.prototype.initMembers = function() {
		GCB.call(this);
		this._window = false;
		this._windowId = 0;
	}
	//発言ウィンドウ作成
	Scene_Map.prototype.createSpeakWindow = function() {
		if (!SceneManager._scene._speakWindow[0]){
			SceneManager._scene._speakWindow[0] = new Window_Speak();
			SceneManager._scene.addChild(SceneManager._scene._speakWindow[0]);
			SceneManager._scene._speakWindow[0].id = 0;
			SceneManager._scene.newWindowId = 0;
		}else{
			for (var i = 1; i < 10; i++){
				if (!SceneManager._scene._speakWindow[i]) {
					SceneManager._scene._speakWindow[i] = new Window_Speak();
			        SceneManager._scene.addChild(SceneManager._scene._speakWindow[i]);
					SceneManager._scene._speakWindow[i].id = i;
					SceneManager._scene.newWindowId = i;
					break;
				}
			}
		}
	}
	
	//発言ウィンドウ。
    function Window_Speak() {
        this.initialize.apply(this, arguments);
    }
	
    Window_Speak.prototype = Object.create(Window_Base.prototype);
    Window_Speak.prototype.constructor = Window_Speak;

    Window_Speak.prototype.initialize = function() {
        var width = 500;
        var height = this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.opacity = 255;
        this.contentsOpacity = 255;
		this.wait = 60;
		this.id = 0;
		this.dialog = "未設定"
        this.refresh();
    };
	Window_Speak.prototype.event = function(event, dialog) {
		if (event._eventId) {
			$gameMap._events[event._eventId]._window = true;
			$gameMap._events[event._eventId]._windowId = this.id;
		}else{
			$gamePlayer._window = true;
			$gamePlayer._windowId = this.id;
		}
        this.eventid = event;
		this.dialog = dialog;
		this.wait = 60;
		this.refresh();
		AudioManager.playSe({"name":"Item1","volume":50,"pitch":150,"pan":0});
    };
    Window_Speak.prototype.refresh = function() {
        this.contents.clear();
		if (this.eventid) {
            this.x = (($gamePlayer.scrolledX()- $gamePlayer._realX + this.eventid._realX) * 48) - (this.textWidth(this.dialog) / 2);
            this.y = (($gamePlayer.scrolledY()- $gamePlayer._realY + this.eventid._realY) * 48) - 90;
			this.makeFontSmaller();
			this.width = this.textWidth(this.dialog) + 48;
            this.drawText(this.dialog, 0, 0, this.contentsWidth(), 'center');
			if (this.wait > 0) {
				this.wait -= 1;
		    }else{
				if (this.opacity > 0){
					this.opacity -= 2;
					this.contentsOpacity -= 2;
				}else{
					this.close();
				}
			}
		}else{
			this.x = 0;
            this.y = 0;
		}
    };
	Window_Speak.prototype.standardPadding = function() {
		return 9;
	}
	
	Window_Speak.prototype.close = function() {
		if (this.eventid._eventId) {
			$gameMap._events[this.eventid._eventId]._window = false;
			$gameMap._events[this.eventid._eventId]._windowId = 0;
		}else{
			$gamePlayer._window = false;
			$gamePlayer._windowId = 0;
		}
		SceneManager._scene._speakWindow[this.id] = null;
	}
	
	//発言台詞の選択。
	function Speak(index, gender) {
		//gender 1 = 女性
		var _speak = "";
		var isYuumi = $gameParty.leader()._equips[0]._itemId == 16;
		switch (index) {
		    case 1:
			    if (gender) {
					var arry = isYuumi ? fs_aliveSpeak : fs_aliveSpeak.concat(fs_aliveSpeakAddGun);
					_speak = arry[Math.floor(Math.random() * arry.length)];
				}else{
					var arry = isYuumi ? ms_aliveSpeak : ms_aliveSpeak.concat(fs_aliveSpeakAddGun);
					_speak = arry[Math.floor(Math.random() * arry.length)];
				}
				break;
			case 2:
				_speak = hitSpeak[Math.floor(Math.random() * hitSpeak.length)];
				break;
			case 3:
				if (gender) {
					_speak = fs_injSpeak[Math.floor(Math.random() * fs_injSpeak.length)];
				}else{
					_speak = ms_injSpeak[Math.floor(Math.random() * ms_injSpeak.length)];
				}
				break;
			case 4:
			    if (gender) {
					_speak = w_teacherSpeak[Math.floor(Math.random() * w_teacherSpeak.length)];
				}else{
					var arry = isYuumi ? teacherSpeak.concat(teacherSpeakAddKnife) : teacherSpeak.concat(teacherSpeakAddGun);;
					_speak = arry[Math.floor(Math.random() * arry.length)];
				}
			    break;
			case 5:
				var temp = isYuumi ? yuumiSpeak : shooterSpeak;
			    _speak = temp[Math.floor(Math.random() * temp.length)];
				break;
		    case 6:
				_speak = yandereSpeak[Math.floor(Math.random() * yandereSpeak.length)];
				break;
		}
		return _speak;
	};
	//発言するイベントのリストを返す。
	Scene_Map.prototype.speakId = function() {
		var speak = true;
		var events = $gameMap._events;
		var list = [];
		for (var i = 1; i <= events.length; i++){
			if ($gameMap._events[i]){
				if ($gameMap._events[i].isNearTheScreen() && $gameVariables._data[1]){
					if ($gameVariables._data[1][$gameMap._mapId]){
						if($gameVariables._data[1][$gameMap._mapId][i] > 0){
							for (var _i = 0; _i <= SceneManager._scene._speakWindow.length; _i++){
								if (SceneManager._scene._speakWindow[_i]) {
									if (SceneManager._scene._speakWindow[_i].eventid._eventId == i) speak = false;
								}
							}
							if (speak) list.push($gameMap._events[i]);
						}
					}
				}
			}
		}
		return list;
	}
	//リストに女性教師はいるか？
	Scene_Map.prototype.w_teacher = function() {
		var list = Scene_Map.prototype.speakId();
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "w_teacher" && hp == 100) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				var rand = Math.floor( Math.random() * 21 ) + 130;
				AudioManager.playSe({"name":"whistle","volume":50,"pitch":rand,"pan":0});
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(4, 1));
				return true;
			}
		}
		return false;
	}
	//リストに対象がいるならランダムで発言。
	Scene_Map.prototype.speakList = function(list) {
		//ヤンデレ
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "yandere" && hp < 100 && hp > 0) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(6, 1));
				return true;
			}
		}
		//教師
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "w_teacher" && hp == 100) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(4, 1));
				var rand = Math.floor( Math.random() * 21 ) + 130;
				AudioManager.playSe({"name":"whistle","volume":50,"pitch":rand,"pan":0});
				return true;
			}
			if(list[i]._characterName == "teacher" && hp == 100) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(4, 0));
				return true;
			}
		}
		//負傷女子生徒
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "female_students " && hp < 100 && hp > 0) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(3, 1));
				return true;
			}
		}
		//負傷男子生徒
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "male_students" && hp < 100 && hp > 0) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(3, 0));
				return true;
			}
		}
		//女子生徒
		for (var i = 0; i <= list.length - 1; i++){
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "female_students " && hp == 100 && !list[i]._playDead) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				SceneManager._scene._speakWindow[temp].event(list[i], Speak(1, 1));
				return true;
			}
		}
		//男子生徒
		for (var i = 0; i <= list.length - 1; i++) {
			var hp = $gameVariables._data[1][$gameMap._mapId][list[i]._eventId];
			if(list[i]._characterName == "male_students" && hp == 100 && !list[i]._playDead) {
				Scene_Map.prototype.createSpeakWindow();
		        var temp = SceneManager._scene.newWindowId;
				var speak = list[i]._fight ? ms_fightSpeak[Math.floor(Math.random() * ms_fightSpeak.length)] : Speak(1, 0);
				if (list[i]._fight){
					
				}else{
					
				}
				
				SceneManager._scene._speakWindow[temp].event(list[i], speak);
				return true;
			}
		}
		return false;
	}
	
	//爆弾スプライトの生成。
	Scene_Map.prototype.createBomb = function(x, y) {
		this._bomb = new Sprite_Blood(x, y);
		this._bomb.type = "bomb";
		this._bomb.bitmap = ImageManager.loadSystem("bomb");
        SceneManager._scene._spriteset._tilemap.addChild(this._bomb);
		if (!bloodMap[$gameMap._mapId]) bloodMap[$gameMap._mapId] = [];
		bloodMap[$gameMap._mapId].push(this._bomb);
	};
	//出血スプライトの生成。
	Scene_Map.prototype.createBlood = function(x, y) {
		var blood = new Sprite_Blood(x, y);
        SceneManager._scene._spriteset._tilemap.addChild(blood);
		if (!bloodMap[$gameMap._mapId]) bloodMap[$gameMap._mapId] = [];
		bloodMap[$gameMap._mapId].push(blood);
	};
	//指定した場所に出血スプライトは存在するか？
	Scene_Map.prototype.isBlood = function(x, y) {
		if (bloodMap[$gameMap._mapId]) {
			for (var i = 0; i <= bloodMap[$gameMap._mapId].length - 1; i++){
				if (Math.floor(bloodMap[$gameMap._mapId][i]._x) == x && Math.floor(bloodMap[$gameMap._mapId][i]._y) == y) return true;
			}
			return false;
		}
	};
	//出血スプライトの定義。
	function Sprite_Blood() {
		this.initialize.apply(this, arguments);
	}
	Sprite_Blood.prototype = Object.create(Sprite.prototype);
	Sprite_Blood.prototype.constructor = Sprite_Blood;
	Sprite_Blood.prototype.initialize = function(x, y) {
		Sprite.prototype.initialize.call(this);
		this.createBitmap();
		this._animationSprites = [];
		this._effectTarget = this;
		this._hiding = false;
		this.type = "blood";
		this._x = x; this.x = x; this.gx = x;
		this._y = y; this.y = y; this.gy = y;
		this.z = 0;
		this.dir = 0;
		this.down = 0;
	};
	Sprite_Blood.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updatePosition();
		this.updateAnimationSprites();
	};
	Sprite_Blood.prototype.createBitmap = function() {
		var rand = Math.floor(Math.random() * 4);
		this.bitmap = ImageManager.loadSystem("blood0" + (rand + 1));
	};
	Sprite_Blood.prototype.updatePosition = function() {
		if (this.type === "bomb") {
			this.x = (($gamePlayer.scrolledX()- $gamePlayer._realX + this._x) * 48);
			this.y = (($gamePlayer.scrolledY()- $gamePlayer._realY + this._y) * 48);
		}else{
			this.x = (($gamePlayer.scrolledX()- $gamePlayer._realX + this._x) * 48);
			this.y = (($gamePlayer.scrolledY()- $gamePlayer._realY + this._y) * 48);
		}
	};
	Sprite_Blood.prototype.updateAnimationSprites = function() {
		if (this._animationSprites.length > 0) {
			var sprites = this._animationSprites.clone();
			this._animationSprites = [];
			for (var i = 0; i < sprites.length; i++) {
				var sprite = sprites[i];
				if (sprite.isPlaying()) {
					this._animationSprites.push(sprite);
				} else {
					this.parent.removeChild(this.sprite);
					SceneManager._scene._spriteset._tilemap.removeChild(this);
				}
			}
		}
	};
	Sprite_Blood.prototype.startAnimation = function(animation, mirror, delay) {
		this.sprite = new Sprite_Animation();
		this.sprite.setup(this._effectTarget, animation, mirror, delay);
		this.parent.addChild(this.sprite);
		this._animationSprites.push(this.sprite);
	};
	
	//装備メニューの変更。
	Window_EquipStatus.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = 256;
		Window_Base.prototype.initialize.call(this, 0, 0, width, height);
		this._actor = null;
		this._tempActor = null;
		this.drawFace("guns1", -1, 0, 30, 144, 144);
		this.refresh();
	};
	Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this.item) {
			if (this.item.id > 8) {
				var gun = "guns2"; 
				var id = this.item.id - 9;
			}else{
				var gun = "guns1";
				var id = this.item.id - 1;
			}
			this.drawFace(gun, id, 0, 30, 144, 144);
			this.changeTextColor(this.textColor(16));
			this.contents.fontSize = 20;
			this.drawText("威力 ", 150, 30); this.drawText("反動 ", 150, 60);
			this.drawText("速射", 150, 90); this.drawText("装弾数 ", 150, 120);
			this.resetTextColor();
			this.drawText(this.item.params[2], 220, 30, 48, 'center');
			this.drawText(this.item.meta.recoil, 220, 60, 48, 'center');
			this.drawText(this.item.meta.speed, 220, 90, 48, 'center');
			this.drawText(this.item.meta.rnd, 220, 120, 48, 'center');
			this.contents.fontSize = 28;
        }
    };
	Scene_Equip.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindow();
        this.createSlotWindow();
        this.createItemWindow();
		this._InfoWindow = new Window_Info();
		this.addWindow(this._InfoWindow);
		this._helpWindow.x = this._statusWindow.width;
		this._helpWindow.width = Graphics.boxWidth - this._statusWindow.width;
		// this._helpWindow.height = this._statusWindow.height / 2;
        this.refreshActor();
		this._slotWindow.activate();
        this._slotWindow.select(0);
		this._helpWindow.refresh();
		// this._slotWindow.opacity = 0;
		// this._helpWindow.opacity = 0;
		// this._statusWindow.opacity = 0;
		// this._itemWindow.opacity = 0;
    };
	Scene_Equip.prototype.createSlotWindow = function() {
        var wx = this._statusWindow.width;
        var wy = this._helpWindow.height;
        var ww = Graphics.boxWidth - this._statusWindow.width;
        var wh = 110;
        this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
        this._slotWindow.setHandler('cancel',   this.popScene.bind(this));
        this.addWindow(this._slotWindow);
    };
	Window_EquipSlot.prototype.updateHelp = function() {
        Window_Selectable.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
		this._statusWindow.item = this.item();
		this._statusWindow.refresh();
    };
	Window_EquipSlot.prototype.drawItem = function(index) {
		if (this._actor) {
			var rect = this.itemRectForText(index);
			this.changeTextColor(this.systemColor());
			this.changePaintOpacity(this.isEnabled(index));
			if (index == 0) {
				this.drawText("主武装", rect.x, rect.y, 138, this.lineHeight());
			}else{ 
				this.drawText("副武装", rect.x, rect.y, 138, this.lineHeight());
			}
			this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
			this.changePaintOpacity(true);
		}
	};
	Window_EquipItem.prototype.includes = function(item) {
        if (item) {
			if ((this._slotId + 1) !== item.wtypeId) {
				return false
			}
		}
		if (item === null) {
			return false;
		}
		if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
			return false;
		}
		return this._actor.canEquip(item);
	};
	Window_EquipItem.prototype.updateHelp = function() {
		Window_ItemList.prototype.updateHelp.call(this);
		if (this._actor && this._statusWindow) {
			var actor = JsonEx.makeDeepCopy(this._actor);
			actor.forceChangeEquip(this._slotId, this.item());
			this._statusWindow.setTempActor(actor);
		}
		this._statusWindow.item = this.item();
		this._statusWindow.refresh();
	};
	Scene_Equip.prototype.createItemWindow = function() {
        var wx = 0;
        var wy = 408;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    };
	function Window_Info() {
        this.initialize.apply(this, arguments);
    }
    Window_Info.prototype = Object.create(Window_Base.prototype);
    Window_Info.prototype.constructor = Window_Info;
	Window_Info.prototype.initialize = function() {
		var x = 0;
		var y = 408 - 70;
	    var width = 320;
	    var height = 70;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
		// this.opacity = 0;
		this.refresh();
	};
	Window_Info.prototype.refresh = function() {
	    this.contents.clear();
		this.changeTextColor(this.textColor(16));
        this.drawIcon(209, 0, 1);
		this.drawText("ロッカーに保管中", 40, 0);
		this.resetTextColor();
	};
	Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
	};
	Window_EquipItem.prototype.isEnabled = function(item) {
		if(item){
			return true;
		}else{
			return false
		}
	};
	//アナウンスメッセージウィンドウの定義。
	function Window_Announcement() {
		this.initialize.apply(this, arguments);
	}
	Window_Announcement.prototype = Object.create(Window_Base.prototype);
	Window_Announcement.prototype.constructor = Window_Announcement;

	Window_Announcement.prototype.initialize = function() {
		var width = 525;
		var height = this.fittingHeight(1);
		Window_Base.prototype.initialize.call(this, 0, 38, width, height);
		this.opacity = 0;
		this.contentsOpacity = 0;
		this._showCount = 0;
		this.textX = 600;
		this.text = "テキストメッセージ";
		this.refresh();
	};

	Window_Announcement.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
			this.contentsOpacity += 16;
			this._showCount--;
			this.textX--;
			this.refresh();
			$gameVariables._data[18] = SceneManager._scene._announcement._showCount;
		} else {

			if ($gameVariables._data[18] > 0){
				this.text = announcement[$gameVariables._data[11] - 1];
				this.textX = $gameVariables._data[18] - this.textWidth(this.text);
				this._showCount = $gameVariables._data[18];
			}else if(this.contentsOpacity > 0) this.contentsOpacity -= 16;
			
			
		}
	};

	Window_Announcement.prototype.open = function(text) {
		AudioManager.playSe({"name":"call_up","volume":50,"pitch":100,"pan":0});
		this.text = announcement[text];
		this.textX = 600;
		this._showCount = this.textWidth(this.text) + 600;
		this.refresh();
	};

	Window_Announcement.prototype.refresh = function() {
		this.contents.clear();
		this.drawBackground(0, 0, 525, this.lineHeight());
		this.drawText(this.text, this.textX, 0, (this.textWidth(this.text) + 48));
	};

	Window_Announcement.prototype.drawBackground = function(x, y, width, height) {
		var color1 = this.dimColor1();
		var color2 = this.dimColor2();
		this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
		this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
	};

	//全体表示メッセージ。
	Window_Message.prototype.numVisibleRows = function() {
		var height = $gameSwitches.value(16) ? 16 : 4;
		return height;
	};
	
	Window_Message.prototype.isEndOfText = function(textState) {
		return textState.index >= textState.text.length;
	};
	
	Window_Message.prototype.onEndOfText = function() {
		if (!this.startInput()) {
			if (!this._pauseSkip) {
				this.startPause();
			} else {
				this.terminateMessage();
			}
		}
		this._textState = null;
	};

	Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
			if ($gameSwitches.value(16) && this.nextEventCode() === 101) {
				this._index++;
			}
        }
        switch (this.nextEventCode()) {
        case 102:  // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
	};
	
    var _Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _Window_Base_resetFontSettings.call(this);
		if ($gameSwitches.value(16)) {
        this.contents.outlineColor = 'rgba(%1,%2,%3,%4)'.format(0, 0, 0, 0);
		}
    };
	
	//スコア表示
	Scene_Map.prototype.score = function(){
		
		var acc = Math.floor(($gameVariables._data[27] / $gameVariables._data[26]) * 100);
		
		this.scoreSprite(420, 60, 80, 40, 35, $gameVariables._data[2]);
		this.scoreSprite(420, 105, 80, 40, 35, $gameVariables._data[3]);
		this.scoreSprite(420, 145, 80, 40, 35, $gameVariables._data[26]);
		this.scoreSprite(420, 185, 80, 40, 35, acc);
		
		this.scoreSprite(368, 267, 70, 40, 35, $gameVariables._data[28]);
		this.scoreSprite(368, 306, 70, 40, 35, $gameVariables._data[29]);
		this.scoreSprite(368, 347, 70, 33, 35, $gameVariables._data[30]);
		this.scoreSprite(368, 382, 70, 30, 35, $gameVariables._data[31]);
		
		this.scoreSprite(368, 414, 130, 50, 35, $gameVariables._data[17]);
		if($gameSwitches.value(35)){
			this.scoreSprite(270, 480, 300, 50, 35, "ヤンデレ殺害ボーナス + 5000 SP");
			$gameSwitches.setValue(35,false);
		}
	};
	Scene_Map.prototype.scoreSprite = function(x, y, w, h, size, type){
		var sprite = new Sprite();
		sprite.bitmap = new Bitmap(w, h);
		sprite.x = x; sprite.y = y;
		sprite.bitmap.outlineColor = "#000000";
		sprite.bitmap.textColor = "#000000";
		sprite.bitmap.fontsize = size;
		sprite.bitmap.outlineWidth = 1;　
		sprite.bitmap.drawText(type, 0, 0, sprite.width, sprite.height, "right");
		SceneManager._scene.addChild(sprite);
	};

	//総合スコア表示
	
	Scene_Map.prototype.totalScore = function(){
		SceneManager._scene._totalScoreWindow = new Window_TotalScore();
		SceneManager._scene.addWindow(SceneManager._scene._totalScoreWindow);
	}
	
	function Window_TotalScore() {
        this.initialize.apply(this, arguments);
    }
    Window_TotalScore.prototype = Object.create(Window_Base.prototype);
    Window_TotalScore.prototype.constructor = Window_TotalScore;
	Window_TotalScore.prototype.initialize = function() {
		var x = 0;
		var y = 0;
	    var width = 816;
	    var height = 624;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.opacity = 0;
		this.contentsOpacity = 255;
		this.contents.fontSize = 80;
		this.drawText($gameVariables._data[15], 360, 120, 270, "right");
		this.contents.fontSize = 40;
		this.drawText($gameVariables._data[32], 570, 236, 110, "right");
		this.drawText($gameVariables._data[33], 570, 297, 110, "right");
		this.drawText($gameVariables._data[34], 570, 360, 110, "right");
	};

	
	//特殊行動可能か。
	Game_Character.prototype.canSpecialAction = function() {
		var px = $gamePlayer._x; var py = $gamePlayer._y;
		var ex = this._x; var ey = this._y;
		var distance = Game_Map.prototype.distance(px, py, ex, ey);
		if (distance > 5){
		  var dir = 0;
		  if (px == ex) {
			var y = py - ey;
			dir = Math.sign(y) != -1 ? 2 : 8;
		  }else if (py == ey) {
			var x = px - ex;
			dir = Math.sign(x) != -1 ? 6 : 4;
		  }
		  x = ex;
		  y = ey;
		  switch (dir) {
		  case 2:
		    while (y != py) {
				if ($gameMap.regionId(ex, y) == 4) {
					break;
				}
				if ((y + 1) == py) {
					return false;
				}
				y++;
			}
			break;
		  case 4:
		    while (x != px) {
				if ($gameMap.regionId(x, ey) == 4) break;
				if ((x - 1) == px) {
					return false;
				}
				x--;
			}
			break;
		  case 6:
		    while (x != px) {
				if ($gameMap.regionId(x, ey) == 4) break;
				if ((x + 1) == px) {
					return false;
				}
				x++;
			}
			break;
		  case 8:
		    while (y != py) {
				if ($gameMap.regionId(ex, y) == 4) break;
				if ((y - 1) == py) {
					return false;
				}
				y--;
			}
			break;
		  }
		  
		    if ($gameMap.eventIdXy(ex + 1, ey)) return false; if ($gameMap.eventIdXy(ex - 1, ey)) return false;
			if ($gameMap.eventIdXy(ex, ey + 1)) return false; if ($gameMap.eventIdXy(ex, ey - 1)) return false;
			if ($gameMap.regionId(ex + 1, ey) == (1 || 4)) return true; if ($gameMap.regionId(ex - 1, ey) == (1 || 4)) return true;
			if ($gameMap.regionId(ex, ey + 1) == (1 || 4)) return true; if ($gameMap.regionId(ex, ey - 1) == (1 || 4)) return true;
			
		}
		return false;
	};
	
	//プレイヤーから遠ざかる移動の改良。
	Game_Character.prototype.moveAwayFromCharacter = function(character) {
		var sx = this.deltaXFrom(character.x);
		var sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 6 : 4);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 2 : 8);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 2 : 8);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 6 : 4);
			}
		}
		if (!this.isMovementSucceeded()) this.moveRandom();
	};
	
	//武器取得画面。
	Scene_Shop.prototype.onBuyCancel = function() {
		this.popScene();
	};
	Scene_Shop.prototype.onNumberOk = function() {
		SoundManager.playShop();
		this.doBuy(this._numberWindow.number());
		this.endNumberInput();
		this._goldWindow.refresh();
		this._statusWindow.refresh();
		if ($gameSwitches.value(17)) {
			$gameActors.actor(1).learnSkill(this._item.meta["skill"]);
		}
	};
	Scene_Shop.prototype.endNumberInput = function() {
		this._numberWindow.hide();
		this.activateBuyWindow();
	};
	Scene_Shop.prototype.createDummyWindow = function() {
		var wy = 256;
		var wh = Graphics.boxHeight - wy;
		this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
		this.addWindow(this._dummyWindow);
	};
	Scene_Shop.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this._helpWindow.x = 310; this._helpWindow.y = 0; this._helpWindow.width = Graphics.boxWidth - 310;
		this.createGoldWindow();
		this.createDummyWindow();
		this.createNumberWindow();
		this.createStatusWindow();
		this.createBuyWindow();
		this.createCategoryWindow();
		// this._buyWindow.opacity = 0;
		// this._statusWindow.opacity = 0;
		// this._helpWindow.opacity = 0;
		// this._goldWindow.opacity = 0;
		this.commandBuy();
		this._helpWindow.refresh();
	};
	Scene_Shop.prototype.createStatusWindow = function() {
		this._statusWindow = new Window_ShopStatus(0, 0, 310, 256);
		this._statusWindow.hide();
		this.addWindow(this._statusWindow);
	};
	Scene_Shop.prototype.activateBuyWindow = function() {
		this._buyWindow.setMoney(this.money());
		this._buyWindow.show();
		this._buyWindow.activate();
		if (!$gameSwitches.value(17)) this._statusWindow.show();
	};
	Window_ShopBuy.prototype.windowWidth = function() {
		return Graphics.boxWidth;
	};
	Window_ShopBuy.prototype.drawItem = function(index) {
		var item = this._data[index];
		var rect = this.itemRect(index);
		var priceWidth = 96;
		rect.width -= this.textPadding();
		this.changePaintOpacity(this.isEnabled(item));
		this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
		this.drawText(this.price(item) + " SP", rect.x + rect.width - priceWidth,
					  rect.y, priceWidth, 'right');
		this.changePaintOpacity(true);
	};
	Window_ShopNumber.prototype.windowWidth = function() {
		return Graphics.boxWidth;
	};
	Window_ShopStatus.prototype.initialize = function(x, y, width, height) {
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._item = null;
		this._pageIndex = 0;
		this.refresh();
	};
	Window_ShopStatus.prototype.refresh = function() {
		this.contents.clear();
		if (!$gameSwitches.value(17)){
			if (this._item) {
				if (this._item.id > 8) {
					var gun = "guns2"; 
					var id = this._item.id - 9;
				}else{
					var gun = "guns1";
					var id = this._item.id - 1;
				}
				this.drawFace(gun, id, 0, 30, 144, 144);
				this.changeTextColor(this.textColor(16));
				this.contents.fontSize = 20;
				this.drawText("威力 ", 150, 30);
				this.drawText("反動 ", 150, 60);
				this.drawText("速射", 150, 90);
				this.drawText("装弾数 ", 150, 120);
				this.resetTextColor();
				this.drawText(this._item.params[2], 220, 30, 48, 'center');
				this.drawText(this._item.meta.recoil, 220, 60, 48, 'center');
				this.drawText(this._item.meta.speed, 220, 90, 48, 'center');
				this.drawText(this._item.meta.rnd, 220, 120, 48, 'center');
				this.contents.fontSize = 28;
			}
		}
	};
	Window_ShopBuy.prototype.makeItemList = function() {
		this._data = [];
		this._price = [];
		this._shopGoods.forEach(function(goods) {
			var item = null;
			switch (goods[0]) {
			case 0:
				item = $dataItems[goods[1]];
				break;
			case 1:
				item = $dataWeapons[goods[1]];
				break;
			case 2:
				item = $dataArmors[goods[1]];
				break;
			}
			if (item) {
				if (!$gameParty.hasItem(item, true)) {
					this._data.push(item);
					this._price.push(goods[2] === 0 ? item.price : goods[3]);
				}
			}
		}, this);
	};
	Window_Gold.prototype.refresh = function() {
		var x = this.textPadding();
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
	};

	//前景設定。
	var _Game_Map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function() {
		_Game_Map_initialize.call(this);
		this._parallaxName2 = '';
		this._parallaxZero2 = false;
		this._parallaxLoopX2 = false;
		this._parallaxLoopY2 = false;
		this._parallaxSx2 = 0;
		this._parallaxSy2 = 0;
		this._parallaxX2 = 0;
		this._parallaxY2 = 0;
	};

	Spriteset_Map.prototype.createLowerLayer = function() {
		Spriteset_Base.prototype.createLowerLayer.call(this);
		this.createParallax();
		this.createTilemap();
		this.createCharacters();
		this.createShadow();
		this.createDestination();
		this.createForeParallax();
		this.createWeather();
	};
	
	Spriteset_Map.prototype.update = function() {
		Spriteset_Base.prototype.update.call(this);
		this.updateTileset();
		this.updateParallax();
		this.updateTilemap();
		this.updateShadow();
		this.updateForeParallax();
		this.updateWeather();
	};

	Spriteset_Map.prototype.createForeParallax = function() {
		this._parallax2 = new TilingSprite();
		this._parallax2.move(0, 0, Graphics.width, Graphics.height);
		this._baseSprite.addChild(this._parallax2);
	};
	
	Spriteset_Map.prototype.updateForeParallax = function() {
		if (this._parallaxName2 !== $dataMap.meta.fgName) {
			this._parallaxName2 = $dataMap.meta.fgName || " ";
			this._parallax2.bitmap = ImageManager.loadParallax(this._parallaxName2);
			//WebGLでない時に不具合が起こる可能性？
		}
		if (this._parallax2.bitmap) {
			this._parallax2.origin.x = $gameMap.parallaxOx();
			this._parallax2.origin.y = $gameMap.parallaxOy();
		}
	};

	//実績ウィンドウ。
	function Window_SelectAchievement() {
		this.initialize.apply(this, arguments);
	}

	Window_SelectAchievement.prototype = Object.create(Window_Selectable.prototype);
	Window_SelectAchievement.prototype.constructor = Window_SelectAchievement;

	Window_SelectAchievement.prototype.initialize = function() {
		Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.width / 2, Graphics.height);
		this.refresh();
		this.select(0);
	};
	
	Window_SelectAchievement.prototype.maxItems = function() {
		return this._data ? this._data.length : 1;
	};
	
	Window_SelectAchievement.prototype.item = function() {
		return this._data[this.index()];
	};
	
	Window_SelectAchievement.prototype.isEnabled = function(item) {
		return false;
	};

	Window_SelectAchievement.prototype.refresh = function() {
		this.makeList();
		this.createContents();
		this.drawAllItems();
	};

	Window_SelectAchievement.prototype.makeList = function() {
		var _data = [];
		$dataItems.forEach(function(item) {
		if (item) { 
			if (item.meta["achievement"]){
				_data.push(item);
			}
		}
		 
		});
		this._data = _data;
	};

	Window_SelectAchievement.prototype.drawItem = function(index) {
		var item = this._data[index];
		var rect = this.itemRect(index);
		var priceWidth = 96;
		rect.width -= this.textPadding();
		this.changePaintOpacity(this.isEnabled(item));
		this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
		this.changePaintOpacity(true);
	};

	Scene_Achievement.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_Achievement.prototype.constructor = Scene_Achievement;

	Scene_Achievement.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_Achievement.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.createSelectAchievementWindow();
		this._SelectAchievementWindow.setHandler('cancel', this.popScene.bind(this));
		this._SelectAchievementWindow.activate();
	};

	Scene_Achievement.prototype.createSelectAchievementWindow = function() {
		this._SelectAchievementWindow = new Window_SelectAchievement();
		this.addWindow(this._SelectAchievementWindow);
	};

	//オプション常時ダッシュ・コマンド記憶の削除。
	Window_Options.prototype.makeCommandList = function() {
		this.addVolumeOptions();
	};
	
	//ショットガンTips。
	Scene_Shop.prototype.doBuy = function(number) {
		$gameParty.loseGold(number * this.buyingPrice());
		$gameParty.gainItem(this._item, number);
		if ($gameVariables._data[36] != 2 && Number(this._item.meta.isShotgun)){
			$gameVariables._data[36] = 1;
		}
	};
	//ショップ数値入力スキップ。
	var _Scene_Shop_onBuyOk = Scene_Shop.prototype.onBuyOk;
	Scene_Shop.prototype.onBuyOk = function(){
		_Scene_Shop_onBuyOk.call(this);
		this._numberWindow.onButtonOk();
	};
	
	//装備・ショップ背景変更。
	SceneManager.snapForBackground = function() {
		if(SceneManager.isNextScene(Scene_Shop)){
			this._backgroundBitmap = ImageManager.loadPicture('armoury');
		}else if(SceneManager.isNextScene(Scene_Equip)){
			this._backgroundBitmap = ImageManager.loadPicture('armoury');
		}else if (SceneManager.isNextScene(Scene_Skill)){
			this._backgroundBitmap = ImageManager.loadPicture('armoury');
		}else{
			this._backgroundBitmap = this.snap();
			this._backgroundBitmap.blur();
		}
	};

	//所有スキル
	Scene_Skill.prototype.create = function() {
		Scene_ItemBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createItemWindow();
		this.createActorWindow();
		// this._helpWindow.opacity = 0;
		// this._itemWindow.opacity = 0;
	};

	Scene_Skill.prototype.start = function() {
		Scene_ItemBase.prototype.start.call(this);
		this.refreshActor();
		this._itemWindow.setStypeId(1);
		this._itemWindow.activate();
		this._itemWindow.select(0);
		this._helpWindow.refresh();
	};


	Scene_Skill.prototype.createItemWindow = function() {
		var wx = 0;
		var wy = this._helpWindow.height;
		var ww = Graphics.boxWidth;
		var wh = Graphics.boxHeight - wy;
		this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this.addWindow(this._itemWindow);
	};

	Scene_Skill.prototype.refreshActor = function() {
		var actor = this.actor();
		this._itemWindow.setActor(actor);
	};

	Scene_Skill.prototype.onItemCancel = function() {
		this._itemWindow.deselect();
		this.popScene();
	};

	//セーブ・ロード関係
	Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
		var bottom = rect.y + rect.height;
		if (rect.width >= 420) {
			this.drawText("最高殺害数　   人", rect.x, rect.y + 20, rect.width, 'right');
			if (info.kill) {
				this.drawText(info.kill, rect.x - 35, rect.y + 20, rect.width, 'right');
			}else{
				this.drawText("0", rect.x - 35, rect.y + 20, rect.width, 'right');
			}
		}
		var lineHeight = this.lineHeight();
		var y2 = bottom - lineHeight;
		if (y2 >= lineHeight) {
			this.drawTime(info, rect.x, y2, rect.width);
		} 
	};
	Window_SavefileList.prototype.drawTime = function(info, x, y, width) {
		if (info.time) {
			this.drawText(info.time, x, y, width, 'right');
		}
	};
	DataManager.makeSavefileInfo = function() {
		var info = {};
		info.globalId   = this._globalId;
		info.title      = $dataSystem.gameTitle;
		info.characters = $gameParty.charactersForSavefile();
		info.faces      = $gameParty.facesForSavefile();
		info.playtime   = $gameSystem.playtimeText();
		info.timestamp  = Date.now();
		
		var time = new Date();
		var year = time.getFullYear();
		var month = ("0" + (time.getMonth() + 1)).slice(-2);
		var day = ("0" + time.getDate()).slice(-2);
		var hour = ("0" + time.getHours()).slice(-2);
		var minute = ("0" + time.getMinutes()).slice(-2);
		
		info.time = year + "/" + month + "/" + day + "/ " + hour + ":" + minute;
		info.kill = $gameVariables._data[15];
		info.playCounts = $gameVariables._data[32];
		
		return info;
	};
	
	//選択肢位置調節用
	Window_ChoiceList.prototype.updatePlacement = function() {
		var positionType = $gameMessage.choicePositionType();
		var messageY = this._messageWindow.y;
		this.width = this.windowWidth();
		this.height = this.windowHeight();
		switch (positionType) {
		case 0:
			this.x = 0;
			break;
		case 1:
			this.x = (Graphics.boxWidth - this.width) / 2;
			break;
		case 2:
			this.x = Graphics.boxWidth - this.width;
			break;
		}
		if (messageY >= Graphics.boxHeight / 2) {
			this.y = messageY - this.height;
		} else {
			this.y = messageY + this._messageWindow.height;
		}
		if ($gameVariables._data[38]) this.y = $gameVariables._data[38];
	};
	
	//ボリューム調整量変更
	Window_Options.prototype.volumeOffset = function() {
		return 5;
	};

})();