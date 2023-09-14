<!--
@copyright Copyright 2023, National Institute of Advanced Industrial
           Science and Technology (AIST).

@author Digital Architecture Research Center, Geoinformation Service
        Research Team.

        https://www.digiarc.aist.go.jp/en/team/gsvrt/

@license Licensed under the Apache License, Version 2.0 (the "License");
         you may not use this file except in compliance with the License.

         You may obtain a copy of the License at

           http://www.apache.org/licenses/LICENSE-2.0

         Unless required by applicable law or agreed to in writing,
         software distributed under the License is distributed on
         an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
         either express or implied.

         See the License for the specific language governing permissions and
         limitations under the License.
-->
<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const open = ref(false);

const openAboutModal = () => {
  open.value = true;
};

defineExpose({ openAboutModal });
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div class="mt-3 sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-md text-center font-bold leading-6 text-slate-600"
                  >
                    AIST 3DDB Client</DialogTitle
                  >
                  <DialogDescription class="text-xs text-slate-600">
                    <div class="mt-4 mb-6">
                      <p>
                      AIST 3DDB Client は、国立研究開発法人
                        <a
                          href="https://www.aist.go.jp/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="underline"
                          >産業技術総合研究所</a
                        > (以後、産総研と呼称します) 情報・人間工学領域 デジタルアーキテクチャ研究センター
                        <a
                          href="https://www.digiarc.aist.go.jp/team/gsvrt/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="underline"
                          >地理空間サービス研究チーム</a
                        >が開発・運用・管理するデジタルツインプラットフォームである 3DDB システム向けに開発された Web アプリケーションです。
                      </p>
                      <p>
                      3DDB システムに登録されている様々な三次元データを検索・表示・ダウンロードすることができます。
                      </p>
                    </div>
                    <div>
                      <div class="font-bold mt-5 mb-2 text-center">
                        操作方法
                      </div>
                      <div class="flex flex-col gap-y-2">
                        <p>
                          画面左側から、データの検索ができます。テキスト入力欄に「城」「お台場」「PLATEAU」などと入力し、検索ボタンを押すことで、該当する検索結果が一覧表示されます。
                        </p>
                        <p>
                          デフォルトで「全て」が選択されているプルダウンメニューにより、データの種別で絞って検索できます。
                        </p>
                        <p>
                          「検索（表示領域内）」ボタンにより、現在地図画面で表示されているエリアに存在するものに絞って検索ができます。この時、画面に地平線（上空）が含まれると、表示領域が特定できなくなることに注意してください。
                        </p>
                        <p>
                          検索結果ごとの(i)アイコンをクリックすると、データの詳細がポップアップ表示されます。ダウンロードが許可されるデータではフォルダアイコンが表示され、これをクリックすることでダウンロードできます。
                        </p>
                        <p>
                          検索結果ごとの(+)アイコンをクリックすると、そのデータを地図上に表示できます。表示データは、地図画面左上にカードとして列挙され、その中にある(-)アイコンをクリックすることで削除できます。
                        </p>
                        <p>
                          地図画面では、左クリックとドラッグにより、移動することができます。右クリックとドラッグ、もしくはスクロールにより、ズームすることができます。中央ボタンとドラッグ、もしくはCTRLキーとドラッグにより、視点を傾けたり回転することができます。
                        </p>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold mt-5 mb-2 text-center">
                        利用データ
                      </div>
                      <div class="">
                        <ul class="list-disc list-inside text-left">
                          <li>産総研 3D データベース API</li>
                          <li>
                            国土地理院 - 写真タイル, 標高タイル, ジオイド高（<a
                              href="https://maps.gsi.go.jp/development/ichiran.html"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="underline"
                              >地理院地図｜地理院タイル一覧</a
                            >,
                            <a
                              href="https://fgd.gsi.go.jp/download/geoid.php"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="underline"
                            >
                              ジオイド・モデルの提供｜基盤地図情報ダウンロードサービス</a
                            >）
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold mt-5 mb-2 text-center">
                        ソースコード
                      </div>
                      <div class="flex flex-col gap-y-2">
                        <p>GitHubで公開しています: <a
                              href="https://github.com/aistairc/aist_3ddb_client"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="underline"
                              >aistairc/aist_3ddb_client</a
                            ></p>
                            <p>ライセンスは Apache-2.0 です。</p>
                      </div>
                    </div>
                    <div>
                      <div class="font-bold mt-5 mb-2 text-center">開発元</div>
                      <div class="flex flex-col gap-y-2">
                        <p>
                          当アプリケーションは産総研の委託を受けて、<a
                            href="https://www.mierune.co.jp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="underline"
                            >MIERUNE</a
                          >が開発しました。
                        </p>
                      </div>
                    </div>
                  </DialogDescription>
                </div>
              </div>
              <div class="mt-5 text-right">
                <button
                  type="button"
                  class="rounded-md text-xs text-slate-50 bg-slate-600 px-2 py-1 shadow-sm hover:opacity-75"
                  @click="open = false"
                >
                  閉じる
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
