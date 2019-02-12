// import { DataMapperChain } from "@exploratoryengineering/data-mapper-chain";
// import { ChartData } from "chart.js";
// import { TagHelper } from "Helpers/TagHelper";
// import { Device, TKAQDataPoint } from "Models/Device";

// interface DataBucket {
//   label: any;
//   dataSets: MessageDataSet;
// }

// interface DataBucketSet {
//   [timestampLabel: string]: DataBucket;
// }

// interface MessageDataSet {
//   [dataEUI: string]: TKAQDataPoint[];
// }

// export interface GraphData extends ChartData {
//   graphConfig: GraphConfig;
//   graphMetaData: GraphMetaData;
//   messageData: TKAQDataPoint[];
// }

// interface GraphDataSet {
//   label: string;
//   data: any[];
//   backgroundColor: string;
//   fill: boolean;
// }

// interface GraphMetaData {
//   dataBucketSet: DataBucketSet;
//   dataDeviceIds: string[];
// }

// interface LabelSet {
//   [key: string]: string;
// }

// interface GraphConfig {
//   graphType?: GraphType;
//   chartDataColors?: string[];
//   labels?: LabelSet;
// }

// type GraphType = Array<DataMapperChain | "count" | "count-aggregated">;

// // A bunch of colors from http://epub.wu.ac.at/1692/1/document.pdf
// const defaultColors = [
//   "#023fa5",
//   "#7d87b9",
//   "#bec1d4",
//   "#d6bcc0",
//   "#bb7784",
//   "#8e063b",
//   "#4a6fe3",
//   "#8595e1",
//   "#b5bbe3",
//   "#e6afb9",
//   "#e07b91",
//   "#d33f6a",
//   "#11c638",
//   "#8dd593",
//   "#c6dec7",
//   "#ead3c6",
//   "#f0b98d",
//   "#ef9708",
//   "#0fcfc0",
//   "#9cded6",
//   "#d5eae7",
//   "#f3e1eb",
//   "#f6c4e1",
//   "#f79cd4",
// ];

// const tagHelper = new TagHelper();

// export class GraphController {
//   chartDataColors: string[] = [];
//   chartLabels: LabelSet = {};

//   generateLabelSetFromDevices(devices: Device[]): LabelSet {
//     const labelSet: LabelSet = {};
//     devices.forEach((device) => {
//       labelSet[device.id] = tagHelper.getEntityName(device);
//     });
//     return labelSet;
//   }

//   getGraph(
//     messageData: TKAQDataPoint[],
//     {
//       graphType = ["count-aggregated"],
//       chartDataColors = defaultColors,
//       labels = {},
//     }: GraphConfig = {},
//   ): GraphData {
//     this.chartDataColors = chartDataColors;
//     this.chartLabels = labels;
//     const graphMetaData = this.createGraphMetaData(messageData);

//     const dataBucketSet = graphMetaData.dataBucketSet;

//     let graphDataSets: GraphDataSet[] = [];

//     graphType.forEach((type) => {
//       if (type instanceof DataMapperChain) {
//         graphDataSets = graphDataSets.concat(
//           this.createDataMapperChainGraphDataSet(graphMetaData, type),
//         );
//       } else {
//         switch (type) {
//           case "count-aggregated": {
//             graphDataSets = graphDataSets.concat(
//               this.createCountAggregatedGraphDataSet(graphMetaData),
//             );
//             break;
//           }
//           default: {
//             graphDataSets = graphDataSets.concat(this.createCountGraphDataSet(graphMetaData));
//             break;
//           }
//         }
//       }
//     });

//     return {
//       datasets: graphDataSets,
//       labels: this.getLabelsFromDataBucket(dataBucketSet),
//       graphConfig: {
//         graphType: graphType,
//         chartDataColors: this.chartDataColors,
//         labels: labels,
//       },
//       graphMetaData: graphMetaData,
//       messageData: messageData,
//     };
//   }

//   /**
//    * Convenience method to add data to an existing GraphData object
//    */
//   addToGraph(messageData: TKAQDataPoint, graphData: GraphData): GraphData {
//     graphData.messageData.push(messageData);

//     // Fetch the new dataset.
//     // NOTE: This is the place you want to optimize if stuf goes slow. We strictly doesn't need a full
//     // getGraph, but it simplifies things. Otherwise we would need to delta stuff which is heavy on
//     // complexity.
//     const newGraphData = this.getGraph(graphData.messageData, graphData.graphConfig);

//     // Overwrite meta data
//     graphData.graphMetaData = newGraphData.graphMetaData;

//     // Add the diffed labels to the old dataSet
//     const diffLabels = this.getLabelsFromDataBucket(
//       newGraphData.graphMetaData.dataBucketSet,
//     ).filter((label) => graphData.labels.indexOf(label) < 0);
//     diffLabels.forEach((newLabel) => {
//       graphData.labels.push(newLabel);
//     });

//     // Iterate through all datasets in the new dataset and match with existing data
//     newGraphData.datasets.forEach((newDataSet) => {
//       const foundDataSet = graphData.datasets.find((dataSet) => {
//         return newDataSet.label === dataSet.label;
//       });
//       // Found the dataset in old graph data. This means we just overwrite local data
//       if (foundDataSet) {
//         foundDataSet.backgroundColor = newDataSet.backgroundColor;
//         foundDataSet.data = newDataSet.data;
//       } else {
//         graphData.datasets.push(newDataSet);
//       }
//     });

//     return graphData;
//   }

//   /**
//    * Create GraphDataSet based on the type MapperChain
//    */
//   createDataMapperChainGraphDataSet(
//     graphMetaData: GraphMetaData,
//     dataMapperChain: DataMapperChain,
//   ): GraphDataSet[] {
//     let mapperChainGraphDataSet: GraphDataSet[] = [];

//     graphMetaData.dataDeviceIds.forEach((uid, idx) => {
//       const countGraphData = this.createDataMapperChainGraphData(
//         uid,
//         graphMetaData.dataBucketSet,
//         dataMapperChain,
//       );

//       mapperChainGraphDataSet = mapperChainGraphDataSet.concat([
//         {
//           label: `${this.chartLabels[uid] || uid} - ${dataMapperChain.name || "Unnamed mapper"}`,
//           fill: false,
//           data: countGraphData.data,
//           backgroundColor: this.getColorByIndex(idx),
//         },
//       ]);
//     });

//     return mapperChainGraphDataSet;
//   }

//   /**
//    * Create GraphData based on the type MapperChain
//    */
//   createDataMapperChainGraphData(
//     dataEUI: string,
//     dataBucketSet: DataBucketSet,
//     dataMapperChain: DataMapperChain,
//   ) {
//     const countData: { data: Array<number | undefined> } = { data: [] };

//     Object.keys(dataBucketSet).forEach((label) => {
//       const dataBucket = dataBucketSet[label];

//       if (dataBucket.dataSets[dataEUI]) {
//         countData.data.push(dataMapperChain.mapData(
//           dataBucket.dataSets[dataEUI][0].payload,
//         ) as number);
//       } else {
//         countData.data.push(undefined);
//       }
//     });

//     return countData;
//   }

//   /**
//    * Create GraphDataSet based on the type 'count'
//    */
//   createCountGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
//     let countGraphDataSet: GraphDataSet[] = [];

//     graphMetaData.dataDeviceIds.forEach((uid, idx) => {
//       const countGraphData = this.createCountGraphData(uid, graphMetaData.dataBucketSet);

//       countGraphDataSet = countGraphDataSet.concat([
//         {
//           label: `${this.chartLabels[uid] || uid} - Count`,
//           fill: false,
//           data: countGraphData.data,
//           backgroundColor: this.getColorByIndex(idx),
//         },
//       ]);
//     });

//     return countGraphDataSet;
//   }

//   /**
//    * Create GraphData based on the type 'count'
//    */
//   createCountGraphData(dataEUI: string, dataBucketSet: DataBucketSet) {
//     const countData: { data: Array<number | undefined> } = { data: [] };

//     Object.keys(dataBucketSet).forEach((label) => {
//       const dataBucket = dataBucketSet[label];

//       if (dataBucket.dataSets[dataEUI]) {
//         countData.data.push(dataBucket.dataSets[dataEUI].length);
//       } else {
//         countData.data.push(undefined);
//       }
//     });

//     return countData;
//   }

//   /**
//    * Create GraphDataSet based on the type 'count-aggregated'
//    */
//   createCountAggregatedGraphDataSet(graphMetaData: GraphMetaData): GraphDataSet[] {
//     let aggregatedCountGraphDataSet: GraphDataSet[] = [];

//     const data: number[] = [];

//     Object.keys(graphMetaData.dataBucketSet).forEach((label) => {
//       let labelCount = 0;

//       Object.keys(graphMetaData.dataBucketSet[label].dataSets).forEach((uid) => {
//         labelCount += graphMetaData.dataBucketSet[label].dataSets[uid].length;
//       });

//       data.push(labelCount);
//     });

//     aggregatedCountGraphDataSet = aggregatedCountGraphDataSet.concat([
//       {
//         label: `Number of received messages`,
//         fill: false,
//         data: data,
//         backgroundColor: this.getColorByIndex(0),
//       },
//     ]);

//     return aggregatedCountGraphDataSet;
//   }

//   private getLabelsFromDataBucket(dataBucketSet: DataBucketSet) {
//     return Object.keys(dataBucketSet).map((dataKey) => dataBucketSet[dataKey].label);
//   }

//   /**
//    * Fetches a chart color based on given index
//    */
//   private getColorByIndex(index: number): string {
//     return this.chartDataColors[index % this.chartDataColors.length];
//   }

//   /**
//    * Create GraphMetaData based on the given MessageData set
//    */
//   private createGraphMetaData(messageData: TKAQDataPoint[]): GraphMetaData {
//     const dataBucketSet: DataBucketSet = {};

//     const dataDeviceIds: string[] = [];

//     messageData.forEach((message) => {
//       // Add data bucket set
//       if (dataBucketSet[message.timestamp]) {
//         dataBucketSet[message.timestamp].dataSets[message.deviceId] = [message];
//       } else {
//         dataBucketSet[message.timestamp] = {
//           label: message.timestamp,
//           dataSets: {},
//         };
//         dataBucketSet[message.timestamp].dataSets[message.deviceId] = [message];
//       }
//       // Add unique euis
//       if (!dataDeviceIds.includes(message.deviceId)) {
//         dataDeviceIds.push(message.deviceId);
//       }
//     });

//     dataDeviceIds.sort((a, b) => {
//       if (a < b) {
//         return -1;
//       } else {
//         return 1;
//       }
//     });

//     return {
//       dataBucketSet: dataBucketSet,
//       dataDeviceIds: dataDeviceIds,
//     };
//   }
// }
